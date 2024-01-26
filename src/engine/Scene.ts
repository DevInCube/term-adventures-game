import { GameEvent, GameEventHandler } from "./events/GameEvent";
import { SceneObject } from "./objects/SceneObject";
import { Cell, CellDrawOptions } from "./graphics/Cell";
import { emitEvent } from "./events/EventLoop";
import { drawCell, drawObjects, drawParticles, mixColors } from "./graphics/GraphicsEngine";
import { CanvasContext } from "./graphics/CanvasContext";
import { Npc } from "./objects/Npc";
import { Camera } from "./Camera";
import { Level } from "./Level";
import * as utils from "./../utils/layer";
import { TransferItemsGameEvent } from "../world/events/TransferItemsGameEvent";
import { SwitchGameModeGameEvent } from "../world/events/SwitchGameModeGameEvent";
import { RemoveObjectGameEvent } from "../world/events/RemoveObjectGameEvent";
import { AddObjectGameEvent } from "../world/events/AddObjectGameEvent";
import { Tile } from "./objects/Tile";
import { ActionData, convertToActionData } from "./ActionData";
import { Particle } from "./objects/Particle";
import { createWeatherParticle, getWeatherSkyTransparency } from "./WeatherSystem";
import { waterRippleSprite } from "../world/sprites/waterRippleSprite";
import { Vector2 } from "./data/Vector2";
import { Box2 } from "./data/Box2";
import { numberToHexColor } from "../utils/color";

const defaultLightLevelAtNight = 4;
const defaultLightLevelAtDay = 15;
const defaultTemperatureAtNight = 4;  // @todo depends on biome.
const defaultTemperatureAtDay = 7; // @todo depends on biome.
const defaultMoisture = 5;  // @todo depends on biome.

const voidCell = new Cell(' ', 'transparent', 'black');

type DebugDrawOptions = {
    drawUndefined: boolean,
    textColor: (value: number) => string,
    backgroundColor: (value: number) => string,
    cellOptions: CellDrawOptions,
};

const defaultDebugDrawOptions: DebugDrawOptions = {
    drawUndefined: true,
    textColor: _ => `gray`,
    backgroundColor: v => numberToHexColor(v, 15, 0),
    cellOptions: {
        bold: false,
        miniCellPosition: Vector2.zero,
        opacity: 0.3,
        scale: 1,
    },
};

export class Scene implements GameEventHandler {
    level: Level;
    camera: Camera = new Camera();
    gameTime = 0;
    ticksPerDay: number = 120000;
    globalLightLevel: number = 0;
    globalTemperature: number = 7;
    globalMoisture: number = defaultMoisture;
    debugDrawTemperatures: boolean = false;
    debugDrawMoisture: boolean = false;
    debugDrawBlockedCells: boolean = false;
    debugDrawSignals: boolean = false;
    debugDisableGameTime: boolean = false;
    debugTickFreeze: boolean = false;
    debugTickStep: number = 0;

    get objects() {
        return this.level?.objects || [];
    }

    get particles() {
        return this.level?.particles || [];
    }

    get levelBox(): Box2 {
        return new Box2(Vector2.zero, (this.level?.size?.clone() || Vector2.zero).sub(new Vector2(1, 1)));
    }

    get windBox(): Box2 {
        const margin = (this.level?.wind?.clone() || Vector2.zero).multiplyScalar(2);
        return this.levelBox.clone().expandByVector(margin);
    } 

    handleEvent(ev: GameEvent): void {
        if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
            emitEvent(SwitchGameModeGameEvent.create("scene", "dialog"));
        } else if (ev.type === AddObjectGameEvent.type) {
            const args = <AddObjectGameEvent.Args>ev.args;
            this.addLevelObject(args.object);
            console.log(`${args.object.type} added to the scene.`);
        } else if (ev.type === RemoveObjectGameEvent.type) {
            const args = <RemoveObjectGameEvent.Args>ev.args;
            this.removeLevelObject(args.object);
            console.log(`${args.object.type} removed from scene.`);
        } else if (ev.type === TransferItemsGameEvent.type) {
            const args = <TransferItemsGameEvent.Args>ev.args;
            args.recipient.inventory.addItems(args.items);
            console.log(`${args.recipient.type} received ${args.items.length} items.`);
        }
    }

    update(ticks: number) {
        const scene = this;

        if (!this.debugDisableGameTime) {
            this.gameTime += ticks;
        }
        
        this.level?.update(ticks, this);

        const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
        // 0.125 (1/8) so the least amount of sunlight is at 03:00
        const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
        scene.globalLightLevel = defaultLightLevelAtNight + Math.round(sunlightPercent * (defaultLightLevelAtDay - defaultLightLevelAtNight)); 
        scene.globalTemperature = defaultTemperatureAtNight + Math.round(sunlightPercent * (defaultTemperatureAtDay - defaultTemperatureAtNight));

        // update all tiles
        for (const tile of scene.level?.tiles?.flat() || []) {
            tile.update(ticks, scene);
        }
        
        // update all enabled objects
        for (const obj of scene.objects) {
            if (!obj.enabled) continue;

            obj.update(ticks, scene);
        }

        for (const particle of scene.level?.weatherParticles || []) {
            particle.update(ticks, scene);
        }

        for (const particle of scene.particles) {
            particle.update(ticks, scene);
        }

        this.camera.update();

        updateBlocked();
        updateTransparency();
        updateLights();
        updateWeather();
        updateTemperature();
        updateMoisture();

        if (!this.debugTickFreeze || this.debugTickStep > 0) {
            this.level?.signalProcessor.update.bind(this.level?.signalProcessor)(this);
            if (this.debugTickStep > 0) {
                this.debugTickStep -= 1;
            }
        }

        function updateBlocked() {
            const blockedLayer: boolean[][] = [];
            fillLayer(blockedLayer, false);
            for (const object of scene.objects) {
                if (!object.enabled) continue;

                for (let y = 0; y < object.physics.collisions.length; y++) {
                    for (let x = 0; x < object.physics.collisions[y].length; x++) {
                        if ((object.physics.collisions[y][x] || ' ') === ' ') continue;

                        const cellPos = new Vector2(x, y);
                        const result = object.position.clone().sub(object.originPoint).add(cellPos);
                        if (!scene.isPositionValid(result)) continue;

                        blockedLayer[result.y][result.x] = true;
                    }
                }
            }

            if (scene.level) {
                scene.level.blockedLayer = blockedLayer;
            }
        }

        function updateTransparency() {
            const transparencyLayer: number[][] = [];
            fillLayer(transparencyLayer, 0);
            for (const object of scene.objects) {
                if (!object.enabled) continue;

                const objectLayer = object.physics.transparency;
                for (let y = 0; y < objectLayer.length; y++) {
                    for (let x = 0; x < objectLayer[y].length; x++) {
                        const char = objectLayer[y][x] || '0'; 
                        const value = Number.parseInt(char, 16);
                        if (value === 0) continue;

                        const cellPos = new Vector2(x, y);
                        const result = object.position.clone().sub(object.originPoint).add(cellPos);
                        if (!scene.isPositionValid(result)) continue;

                        transparencyLayer[result.y][result.x] = value;
                    }
                }
            }

            if (scene.level) {
                scene.level.transparencyLayer = transparencyLayer;
            }
        }

        function updateWeather() {
            if (!scene.level) {
                return;
            }

            scene.level.cloudLayer = [];
            fillLayer(scene.level.cloudLayer, 15 - Math.round(15 * getWeatherSkyTransparency(scene.level.weatherType)) | 0);
            // TODO: implement random noise clouds.

            const weatherTicksOverflow = scene.level.weatherTicks - 300;
            if (weatherTicksOverflow >= 0) {
                updateWeatherParticles();
                scene.level.weatherTicks = weatherTicksOverflow;
            }

            updateWeatherLayer();

            const windTicksOverflow = scene.level.windTicks - 1000;
            if (windTicksOverflow >= 0) {
                updateWeatherWind();
                scene.level.windTicks = windTicksOverflow;
            }

            function updateWeatherParticles() {
                const box = scene.windBox;
                for (let y = box.min.y; y < box.max.y; y++) {
                    for (let x = box.min.x; x < box.max.x; x++) {
                        const levelPosition = new Vector2(x, y);
                        if (!scene.isRoofHoleAt(levelPosition)) {
                            continue;
                        }
                        
                        const existingParticle = getWeatherParticleAt(levelPosition); 
                        if (existingParticle) {
                            continue;
                        }
                        
                        const newParticle = createWeatherParticle(scene.level.weatherType, levelPosition);
                        if (!newParticle) {
                            continue;
                        }

                        scene.level.weatherParticles.push(newParticle);
                    }
                }
            }

            function updateWeatherLayer() {
                const layer: Cell[][] = [];
                for (let y = 0; y < scene.camera.size.height; y++) {
                    for (let x = 0; x < scene.camera.size.width; x++) {
                        const cameraPos = new Vector2(x, y);
                        const levelPosition = scene.cameraTransformation(cameraPos);
                        const existingParticle = getWeatherParticleAt(levelPosition); 
                        if (!existingParticle) {
                            continue;
                        }

                        const cells = existingParticle.skin.getCellsAt(Vector2.zero);

                        // TODO: here I assume that there can not be a composite skin in a weather particle.
                        const cell = cells[0];
                        if (!cell) {
                            continue;
                        }

                        if (!layer[y]) {
                            layer[y] = [];
                        }
    
                        layer[y][x] = cell;
                    }
                }

                scene.level.weatherLayer = layer;
            }

            function getWeatherParticleAt(position: Vector2): Particle | undefined {
                return scene.level.weatherParticles.find(p => p.position.equals(position)); 
            }
            
            function updateWeatherWind() {
                // Push weather particles with wind direction.
                for (const particle of scene.level.weatherParticles) {
                    particle.position.add(scene.level.wind);
                }

                // Remove weather particles out of level bounds (+border).
                for (const particle of scene.level.weatherParticles) {
                    if (!scene.windBox.containsPoint(particle.position)) {
                        scene.removeWeatherParticle(particle);
                    }
                }

                // Push particles with wind direction.
                for (const particle of scene.particles) {
                    particle.position.add(scene.level.wind);
                }

                // Remove particles out of level bounds (+border).
                for (const particle of scene.particles) {
                    if (!scene.windBox.containsPoint(particle.position)) {
                        scene.removeParticle(particle);
                    }
                }
            }
        }

        type LightLayer = {
            lights: number[][],
            color: [number, number, number],
        };

        function updateLights() {
            if (!scene.level) {
                return;
            }

            // clear
            scene.level.lightLayer = [];
            fillLayer(scene.level.lightLayer, 0);
            
            scene.level.lightColorLayer = [];
            fillLayer(scene.level.lightColorLayer, null);

            const ambientLayer: number[][] = [];
            fillLayer(ambientLayer, 0);

            const maxValue = 15;
            for (let y = 0; y < scene.level.size.height; y++) {
                for (let x = 0; x < scene.level.size.width; x++) {
                    const cloudValue = scene.level.cloudLayer[y]?.[x] || 0;
                    const roofValue = scene.level.roofLayer[y]?.[x] || 0;
                    const cloudOpacity = (maxValue - cloudValue) / maxValue;
                    const roofOpacity = (maxValue - roofValue) / maxValue;
                    const opacity = cloudOpacity * roofOpacity;
                    const cellLightLevel = Math.round(scene.globalLightLevel * opacity) | 0;
                    if (cellLightLevel === 0) {
                        continue;
                    }

                    const position = new Vector2(x, y);
                    addEmitter(ambientLayer, position, cellLightLevel);
                    spreadPoint(ambientLayer, position, 0);
                }
            }
            
            const lightLayers: LightLayer[] = []; 
            lightLayers.push({ lights: ambientLayer, color: scene.level.ambientLightColor, });

            const lightObjects = [...scene.objects];

            for (const obj of lightObjects) {
                if (!obj.enabled) continue;

                lightLayers.push(...getObjectLightLayers(obj));
                for (const child of obj.children) {
                    lightLayers.push(...getObjectLightLayers(child));
                }
            }

            mergeLightLayers(lightLayers);
        }

        function getObjectLightLayers(obj: SceneObject): LightLayer[] {
            const lightLayers: LightLayer[] = [];
            for (const [top, string] of obj.physics.lights.entries()) {
                for (let [left, char] of string.split('').entries()) {
                    const light = getLightIntensityAndColor(obj, char);
                    if (light.intensity === 0) {
                        continue;
                    }

                    const charPos = new Vector2(left, top);
                    const position = obj.position.clone().sub(obj.originPoint).add(charPos);
                    if (!scene.isPositionValid(position)) {
                        continue;
                    }

                    const layer: number[][] = [];
                    fillLayer(layer, 0);
                    addEmitter(layer, position, light.intensity);
                    spreadPoint(layer, position, 0);

                    lightLayers.push({ lights: layer, color: light.color });
                }
            }

            return lightLayers;
        }

        function getLightIntensityAndColor(obj: SceneObject, char: string) {
            let color: [number, number, number] = [255, 255, 255];
            if (obj.physics.lightsMap) {
                const record = obj.physics.lightsMap[char];
                char = record.intensity;
                color = record.color;
            }

            const lightLevel = Number.parseInt(char, 16);
            return { intensity: lightLevel, color: color };
        }

        function mergeLightLayers(lightLayers: LightLayer[]) {
            if (!lightLayers.length) {
                return;
            }

            for (let y = 0; y < scene.level.lightLayer.length; y++) {
                for (let x = 0; x < scene.level.lightLayer[y].length; x++) {
                    const colors: { color:[number, number, number], intensity: number }[] = lightLayers
                        .map(layer => ({ color: layer.color, intensity: layer.lights[y][x] }))
                        .filter(x => x.color && x.intensity);
                    const intensity = colors.map(x => x.intensity).reduce((a, x) => a += x, 0) | 0;
                    //const intensity = Math.max(...colors.map(x => x.intensity));
                    scene.level.lightLayer[y][x] = Math.min(15, Math.max(0, intensity)); 
                    scene.level.lightColorLayer[y][x] = mixColors(colors);
                }
            }
        }

        function updateTemperature() {
            if (!scene.level) {
                return;
            }

            if (scene.level.temperatureLayer.length === 0) {
                scene.level.temperatureLayer = [];
                fillLayer(scene.level.temperatureLayer, scene.globalTemperature);
            }

            if (scene.level.temperatureTicks > 1000) {
                scene.level.temperatureTicks = 0;
                // Cool down step.
                for (let y = 0; y < scene.level.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.level.temperatureLayer[y].length; x++) {
                        // cool down slower than warm up.
                        scene.level.temperatureLayer[y][x] -= 1;
                    }
                }

                // iterate temp points (sources) in objects
                const temperatureObjects = [...scene.objects];
                for (const obj of temperatureObjects) {
                    if (!obj.enabled) continue;

                    addObjectTemperature(obj);
                    for (const child of obj.children) {
                        addObjectTemperature(child);
                    }
                }

                var newTemperatureLayer: number[][] = [];
                fillLayer(newTemperatureLayer, scene.globalTemperature);
                for (let y = 0; y < scene.level.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.level.temperatureLayer[y].length; x++) {
                        const layerPos = new Vector2(x, y);
                        meanPoint(scene.level.temperatureLayer, newTemperatureLayer, layerPos);
                    }
                }
                scene.level.temperatureLayer = newTemperatureLayer;

                for (let y = 0; y < scene.level.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.level.temperatureLayer[y].length; x++) {
                        if (scene.level.temperatureLayer[y][x] < scene.globalTemperature) {
                            scene.level.temperatureLayer[y][x] = scene.globalTemperature;
                        }
                    }
                }
            }
        }

        function addObjectTemperature(obj: SceneObject) {
            for (const [top, string] of obj.physics.temperatures.entries()) {
                for (const [left, char] of string.split('').entries()) {
                    const temperature = Number.parseInt(char, 16);
                    const charPos = new Vector2(left, top);
                    const position = obj.position.clone().sub(obj.originPoint).add(charPos);
                    if (!scene.isPositionValid(position)) {
                        continue;
                    }
                    
                    addEmitter(scene.level.temperatureLayer, position, temperature);
                }
            }
        }

        function fillLayer<T>(layer: T[][], defaultValue: T) {
            const size = scene.level?.size || Vector2.zero;
            utils.fillLayer(size, defaultValue, layer);
        }

        function addEmitter(layer: number[][], position: Vector2, level: number) {
            const [left, top] = position;
            if (layer[top] && 
                typeof layer[top][left] !== "undefined" &&
                layer[top][left] < level) {
                layer[top][left] = level;
            }
        }

        function meanPoint(array: number[][], newArray: number[][], [x, y]: Vector2, speed: number = 2) {
            if (!array) {
                return;
            }

            if (y >= array.length || x >= array[y].length) {
                return;
            }

            let maxValue = array[y][x];
            for (let i = Math.max(0, y - 1); i <= Math.min(array.length - 1, y + 1); i++) {
                for (let j = Math.max(0, x - 1); j <= Math.min(array[i].length - 1, x + 1); j++) {
                    if ((i === y || j === x) && !(i === y && j === x) 
                        && array[i][j] > maxValue) {
                        maxValue = array[i][j];
                    }
                }
            }
            
            if (!newArray[y]) {
                newArray[y] = [];
            }
            
            newArray[y][x] = Math.max(array[y][x], maxValue - speed); 
        }

        function spreadPoint(array: number[][], position: Vector2, min: number, speed: number = 2) {
            if (!array) {
                return;
            }

            const positionTransparency = scene.getPositionTransparency(position);
            if (positionTransparency === 0) {
                return;
            }

            const [x, y] = position;
            if (y >= array.length || x >= array[y].length) return;

            const level = array[y][x];
            const originalNextLevel = level - speed;
            const nextLevel = Math.round(originalNextLevel * positionTransparency) | 0;
            speed = speed + (originalNextLevel - nextLevel)
            if (nextLevel <= min) {
                return;
            }

            for (let j = -1; j <= 1; j++) {
                for (let i = -1; i <= 1; i++) {
                    if (j === i || j + i === 0) {
                        // Diagonals.
                        continue;
                    }

                    const nextPosition = new Vector2(x + j, y + i);
                    if (nextPosition.y < 0 ||
                        nextPosition.y > array.length ||
                        nextPosition.x < 0 ||
                        nextPosition.x > array[0].length) {
                        // Out of bounds.
                        continue;
                    }

                    if (array[nextPosition.y][nextPosition.x] >= nextLevel) {
                        continue;
                    }
                    
                    array[nextPosition.y][nextPosition.x] = nextLevel;
                    spreadPoint(array, nextPosition, min, speed);
                }
            }
        }

        function updateMoisture() {
            if (!scene.level) {
                return;
            }

            // @todo check water tiles
            scene.level.moistureLayer = [];
            fillLayer(scene.level.moistureLayer, scene.globalMoisture);
        }
    }

    draw(ctx: CanvasContext) {
        const scene = this;
        drawTiles();
        drawTileEffects();

        // sort objects by origin point
        this.level.objects.sort((a: SceneObject, b: SceneObject) => a.position.y - b.position.y);
        
        drawObjects(ctx, this.camera, this.objects);
        drawParticles(ctx, this.camera, this.particles);
        drawWeather();
        
        if (scene.debugDrawTemperatures) {
            drawTemperatures();
        }

        if (scene.debugDrawMoisture) {
            drawMoisture();
        }

        if (scene.debugDrawBlockedCells) {
            drawBlockedCells();
        }

        if (scene.debugDrawSignals) {
            drawSignals();
        }

        function drawTiles() {
            drawLayer(scene.level.tiles, scene.cameraTransformation.bind(scene), c => c ? c.skin.getCellsAt(Vector2.zero)[0] : voidCell);
        }

        function drawTileEffects() {
            drawLayer(scene.level.tiles, scene.cameraTransformation.bind(scene), c => getTileEffect(c));

            function getTileEffect(tile: Tile | undefined): Cell | undefined {
                if (!tile) {
                    return undefined;
                }
                
                if (tile.category === "solid" && tile.snowLevel > 0) {
                    return new Cell(' ', undefined, `#fff${(tile.snowLevel * 2).toString(16)}`);
                }

                if (tile.category === "liquid" && tile.isDisturbed) {
                    const frame = waterRippleSprite.frames[Particle.defaultFrameName][tile.disturbanceLevel];

                    // TODO: Here I assume that water ripple effect skin is not composite. 
                    return frame.getCellsAt(Vector2.zero)[0];
                }

                return undefined;
            }
        }

        function drawWeather() {
            drawLayer(scene.level.weatherLayer, p => p, c => c, "weather");
        }

        function drawTemperatures() {
            drawDebugLayer(scene.level.temperatureLayer);
        }

        function drawMoisture() {
            drawDebugLayer(scene.level.moistureLayer);
        }

        function drawSignals() {
            const options: DebugDrawOptions = {
                drawUndefined: false,
                textColor: _ => `white`,
                backgroundColor: v => v ? 'red' : 'black',
                cellOptions: { 
                    miniCellPosition: new Vector2(0, 0),
                    scale: 0.333,
                    bold: true,
                    opacity: 1,
                },
            };
            drawDebugLayer(scene.level.signalProcessor.signalLayer, options);
        }

        function drawBlockedCells() {
            drawLayer(scene.level.blockedLayer, scene.cameraTransformation.bind(scene), createCell);

            function createCell(b: boolean | undefined) {
                return b === true ? new Cell('⛌', `#f00c`, `#000c`) : undefined;
            }
        }

        function drawLayer<T>(
            layer: T[][], 
            transformation: (p: Vector2) => Vector2, 
            cellFactory: (value: T | undefined) => Cell | undefined,
            layerName: "objects" | "weather" | "ui" = "objects") {
        
            for (let y = 0; y < scene.camera.size.height; y++) {
                for (let x = 0; x < scene.camera.size.width; x++) {
                    const cameraPos = new Vector2(x, y);
                    const resultPos = transformation(cameraPos);
                    const value = layer[resultPos.y]?.[resultPos.x];
                    const cell = cellFactory(value);
                    if (!cell) continue;

                    drawCell(ctx, scene.camera, cell, cameraPos, undefined, undefined, layerName);
                }
            }
        }

        function drawDebugLayer(layer: (number | undefined)[][], drawOptions: DebugDrawOptions = defaultDebugDrawOptions) {
            const alpha = drawOptions.cellOptions.opacity;
            
            drawLayer(layer, scene.cameraTransformation.bind(scene), createCell);

            function createCell(v: number | undefined) {
                const value = v;
                if (typeof v === "undefined" && !drawOptions.drawUndefined) {
                    return;
                }
                const textColor = typeof value !== "undefined"
                    ? `color-mix(in srgb, ${drawOptions.textColor(value)} ${alpha * 100}%, transparent)`
                    : `rgba(128, 128, 128, ${alpha})`;
                const backgroundColor = typeof value !== "undefined"
                    ? `color-mix(in srgb, ${drawOptions.backgroundColor(value)} ${alpha * 100}%, transparent)`
                    : `rgba(0, 0, 0, ${alpha})`;
                const char = typeof v !== "undefined"
                    ? v
                    : ' ';
                const cell = new Cell(char.toString(16), textColor, backgroundColor);
                cell.options = drawOptions.cellOptions;
                return cell;
            }
        }
    }

    private cameraTransformation(position: Vector2): Vector2 {
        return this.camera.position.clone().add(position);
    }

    isRoofHoleAt(pos: Vector2): boolean {
        let roofHoleVal = this.level.roofHolesLayer[pos.y]?.[pos.x];
        return roofHoleVal || typeof roofHoleVal === "undefined";
    }

    getParticleAt(pos: Vector2): Particle | undefined {
        if (!this.windBox.containsPoint(pos)) {
            return undefined;
        }

        return this.particles.find(p => p.position.equals(pos));
    }

    tryAddParticle(particle: Particle): boolean {
        const existingParticle = this.getParticleAt(particle.position);
        if (existingParticle) {
            this.removeParticle(existingParticle);
        }

        this.particles.push(particle);
        return true;
    }

    removeParticle(particle: Particle): void {
        this.level.particles = this.particles.filter(x => x !== particle);
    }

    removeWeatherParticle(particle: Particle): void {
        this.level.weatherParticles = this.level.weatherParticles.filter(x => x !== particle);
    }
 
    isPositionValid(position: Vector2) {
        return this.levelBox.containsPoint(position);
    }

    isPositionBlocked(position: Vector2) {
        const layer = this.level.blockedLayer;
        return layer[position.y]?.[position.x] === true;
    }

    isParticlePositionBlocked(position: Vector2) {
        return !!this.getParticleAt(position);
    }

    getPositionTransparency(position: Vector2): number {
        const layer = this.level.transparencyLayer;
        const transparencyValue = layer[position.y]?.[position.x] || 0;
        return (15 - transparencyValue) / 15;
    }

    getActionsAt(position: Vector2): ActionData[] {
        const scene = this;
        const actions: ActionData[] = [];
        for (const object of scene.objects) {
            if (!object.enabled) continue;
            //
            const objectPos = object.position;
            const objectOrigin = object.originPoint;
            const result = position.clone().sub(objectPos).add(objectOrigin);

            for (const action of object.actions) {
                const aPos = action.position;
                if (aPos.equals(result)) {
                    actions.push(convertToActionData(object, action));
                }
            }
        }

        return actions;
    }

    getNpcAt(position: Vector2): Npc | undefined {
        for (let object of this.level.objects) {
            if (!object.enabled) continue;
            if (!(object instanceof Npc)) continue;
            //
            if (object.position.equals(position)) {
                return object;
            }
        }
        return undefined;
    }

    getTemperatureAt(position: Vector2): number {
        return this.level?.temperatureLayer[position.y]?.[position.x] || 0;
    }

    getLightAt(position: Vector2): number {
        return this.level?.lightLayer[position.y]?.[position.x] || 0;
    }

    getWeatherAt(position: Vector2): string | undefined {
        const value = this.level?.roofHolesLayer[position.y]?.[position.x];
        const isHole = typeof value === "undefined" || value;
        if (!isHole && this.level?.weatherType !== "mist" && this.level?.weatherType !== "heavy_mist") {
            return undefined;
        }

        return this.level?.weatherType || undefined;
    }

    getTileAt(position: Vector2): Tile | undefined {
        return this.level?.tiles?.[position.y]?.[position.x];
    }

    private addLevelObject(object: SceneObject) {
        this.level.objects.push(object);
        object.bindToLevel(this.level);
        object.scene = this;
        // @todo send new event
    }
    
    private removeLevelObject(object: SceneObject) {
        this.level.objects = this.level.objects.filter(x => x !== object);
        object.level = null;
        object.scene = null;
    }
}
