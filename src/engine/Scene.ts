import { GameEvent, GameEventHandler } from "./events/GameEvent";
import { GameObjectAction, ObjectAction, ObjectActionType, SceneObject } from "./objects/SceneObject";
import { Cell } from "./graphics/Cell";
import { emitEvent } from "./events/EventLoop";
import { drawCell, drawObjects, getCellAt } from "./graphics/GraphicsEngine";
import { CanvasContext } from "./graphics/CanvasContext";
import { Npc } from "./objects/Npc";
import { Item } from "./objects/Item";
import { Camera } from "./Camera";
import { Level } from "./Level";
import * as utils from "./../utils/layer";
import { Performance } from "./Performance";
import { TransferItemsGameEvent } from "../world/events/TransferItemsGameEvent";
import { SwitchGameModeGameEvent } from "../world/events/SwitchGameModeGameEvent";
import { RemoveObjectGameEvent } from "../world/events/RemoveObjectGameEvent";
import { AddObjectGameEvent } from "../world/events/AddObjectGameEvent";
import { Tile } from "./objects/Tile";

const defaultLightLevelAtNight = 4;
const defaultLightLevelAtDay = 15;
const defaultTemperatureAtNight = 4;  // @todo depends on biome.
const defaultTemperatureAtDay = 7; // @todo depends on biome.
const defaultMoisture = 5;  // @todo depends on biome.

const voidCell = new Cell(' ', 'transparent', 'black');

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

    get objects() {
        return this.level?.objects || [];
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

        this.gameTime += ticks;
        this.level?.update(ticks);

        const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
        // 0.125 (1/8) so the least amount of sunlight is at 03:00
        const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
        scene.globalLightLevel = defaultLightLevelAtNight + Math.round(sunlightPercent * (defaultLightLevelAtDay - defaultLightLevelAtNight)); 
        scene.globalTemperature = defaultTemperatureAtNight + Math.round(sunlightPercent * (defaultTemperatureAtDay - defaultTemperatureAtNight));
        //console.log({sunlightPercent});

        const perf = new Performance();

        // update all tiles
        for (const tile of scene.level?.tiles?.flat() || []) {
            tile.update(ticks, scene);
        }
        
        // update all enabled objects
        for (const obj of scene.objects) {
            if (!obj.enabled) continue;

            obj.update(ticks, scene);
        }

        this.camera.update();

        perf.measure(updateBlocked);
        perf.measure(updateTransparency);
        perf.measure(updateWeather);
        perf.measure(updateLights);
        perf.measure(updateTemperature);
        perf.measure(updateMoisture);

        perf.report();

        function updateBlocked() {
            const blockedLayer: boolean[][] = [];
            fillLayer(blockedLayer, false);
            for (const object of scene.objects) {
                if (!object.enabled) continue;

                for (let y = 0; y < object.physics.collisions.length; y++) {
                    for (let x = 0; x < object.physics.collisions[y].length; x++) {
                        if ((object.physics.collisions[y][x] || ' ') === ' ') continue;

                        const left = object.position[0] - object.originPoint[0] + x;
                        const top = object.position[1] - object.originPoint[1] + y;
                        if (!scene.isPositionValid([left, top])) continue;

                        blockedLayer[top][left] = true;
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

                        const left = object.position[0] - object.originPoint[0] + x;
                        const top = object.position[1] - object.originPoint[1] + y;
                        if (!scene.isPositionValid([left, top])) continue;

                        transparencyLayer[top][left] = value;
                    }
                }
            }

            if (scene.level) {
                scene.level.transparencyLayer = transparencyLayer;
            }
        }

        function getSkyTransparency(): number {
            switch (scene.level?.weatherType) {
                case 'rain':
                case 'snow':
                case 'rain_and_snow':
                    return 0.8;
                case 'mist':
                    return 0.7;
                default: return 1;
            }
        }
        
        function updateWeather() {
            if (!scene.level) {
                return;
            }

            scene.level.cloudLayer = [];
            fillLayer(scene.level.cloudLayer, 15 - Math.round(15 * getSkyTransparency()) | 0);

            if (scene.level.weatherTicks > 300) {
                scene.level.weatherTicks = 0;
                scene.level.weatherLayer = [];

                const weatherType = scene.level.weatherType;
                const roofHoles = scene.level.roofHolesLayer;

                for (let y = 0; y < scene.camera.size.height; y++) {
                    for (let x = 0; x < scene.camera.size.width; x++) {
                        const top = y + scene.camera.position.top;
                        const left = x + scene.camera.position.left;
                        let roofHoleVal = (roofHoles[top] && roofHoles[top][left]);
                        if (typeof roofHoleVal === "undefined") roofHoleVal = true; 
                        if (!roofHoleVal && weatherType !== 'mist') continue;

                        const cell = createCell();
                        if (!cell) continue;
                        
                        addCell(cell, x, y);
                    }
                }
                function addCell(cell: Cell, x: number, y: number) {
                    if (!scene.level.weatherLayer[y])
                        scene.level.weatherLayer[y] = [];
                    scene.level.weatherLayer[y][x] = cell;
                }
                function createCell() : Cell | undefined {
                    const rainColor = 'cyan';
                    const snowColor = '#fff9';
                    const mistColor = '#fff2';
                    if (weatherType === 'rain') {
                        const sym = ((Math.random() * 2 | 0) === 1) ? '`' : ' ';
                        return new Cell(sym, rainColor, 'transparent');
                    } else if (weatherType === 'snow') {
                        const r = (Math.random() * 8 | 0);
                        if (r === 0)
                            return new Cell('❅', snowColor, 'transparent');
                        else if (r === 1)
                            return new Cell('❆', snowColor, 'transparent');
                        else if (r === 2)
                            return new Cell('✶', snowColor, 'transparent');
                        else if (r === 3)
                            return new Cell('•', snowColor, 'transparent');
                    } else if (weatherType === 'rain_and_snow') {
                        const r = Math.random() * 3 | 0;
                        if (r === 1)
                            return new Cell('✶', snowColor, 'transparent');
                        else if (r === 2)
                            return new Cell('`', rainColor, 'transparent');
                    } else if (weatherType === 'mist') {
                        if ((Math.random() * 2 | 0) === 1)
                            return new Cell('*', 'transparent', mistColor);
                    }

                    return undefined;
                }
            }
        }

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
            for (let y = 0; y < scene.level.height; y++) {
                for (let x = 0; x < scene.level.width; x++) {
                    const cloudValue = (scene.level.cloudLayer[y] && scene.level.cloudLayer[y][x]) || 0;
                    const roofValue = (scene.level.roofLayer[y] && scene.level.roofLayer[y][x]) || 0;
                    const cloudOpacity = (maxValue - cloudValue) / maxValue;
                    const roofOpacity = (maxValue - roofValue) / maxValue;
                    const opacity = cloudOpacity * roofOpacity;
                    const cellLightLevel = Math.round(scene.globalLightLevel * opacity) | 0;
                    if (cellLightLevel === 0) {
                        continue;
                    }

                    const position: [number, number] = [x, y];
                    addEmitter(ambientLayer, position, cellLightLevel);
                    spreadPoint(ambientLayer, position, 0);
                }
            }
            
            const lightLayers: { lights: number[][], color: [number, number, number], }[] = []; 
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

        function getObjectLightLayers(obj: SceneObject): { lights: number[][], color: [number, number, number] }[] {
            const lightLayers: { lights: number[][], color: [number, number, number] }[] = [];
            for (const [top, string] of obj.physics.lights.entries()) {
                for (let [left, char] of string.split('').entries()) {
                    const light = getLightIntensityAndColor(obj, char);
                    if (light.intensity === 0) {
                        continue;
                    }

                    const position: [number, number] = [
                        obj.position[0] - obj.originPoint[0] + left,
                        obj.position[1] - obj.originPoint[1] + top
                    ];
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

        function mergeLightLayers(lightLayers: { lights: number[][], color: [number, number, number], }[]) {
            if (!lightLayers.length) {
                return;
            }

            for (let y = 0; y < scene.level.lightLayer.length; y++) {
                for (let x = 0; x < scene.level.lightLayer[y].length; x++) {
                    const colors: {color:[number, number, number], intensity: number}[] = lightLayers
                        .map(layer => ({ color: layer.color, intensity: layer.lights[y][x] }))
                        .filter(x => x.color && x.intensity);
                    const intensity = colors.map(x => x.intensity).reduce((a, x) => a += x, 0) | 0;
                    //const intensity = Math.max(...colors.map(x => x.intensity));
                    scene.level.lightLayer[y][x] = Math.min(15, Math.max(0, intensity)); 
                    scene.level.lightColorLayer[y][x] = mixColors(colors);
                }
            }
        }

        function mixColors(colors: { color: [number, number, number], intensity: number }[]): [number, number, number] {
            const totalIntensity = Math.min(1, colors.reduce((a, x) => a += x.intensity / 15, 0));
            const mixedColor: [number, number, number] = [
                Math.min(255, colors.reduce((a, x) => a += x.color[0] * (x.intensity / 15), 0) / totalIntensity | 0),
                Math.min(255, colors.reduce((a, x) => a += x.color[1] * (x.intensity / 15), 0) / totalIntensity | 0),
                Math.min(255, colors.reduce((a, x) => a += x.color[2] * (x.intensity / 15), 0) / totalIntensity | 0),
            ];
            return mixedColor;
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
                        meanPoint(scene.level.temperatureLayer, newTemperatureLayer, x, y);
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
                    const aleft = obj.position[0] - obj.originPoint[0] + left;
                    const atop = obj.position[1] - obj.originPoint[1] + top;
                    const position: [number, number] = [aleft, atop];
                    if (!scene.isPositionValid(position)) {
                        continue;
                    }
                    
                    addEmitter(scene.level.temperatureLayer, position, temperature);
                }
            }
        }

        function fillLayer<T>(layer: T[][], defaultValue: T) {
            const width = scene.level?.width || 0;
            const height = scene.level?.height || 0;
            utils.fillLayer(layer, width, height, defaultValue);
        }

        function addEmitter(layer: number[][], position: [number, number], level: number) {
            const [left, top] = position;
            if (layer[top] && 
                typeof layer[top][left] !== "undefined" &&
                layer[top][left] < level) {
                layer[top][left] = level;
            }
        }

        function meanPoint(array: number[][], newArray: number[][], x: number, y: number, speed: number = 2) {
            if (!array) return;
            if (y >= array.length || x >= array[y].length) return;

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

        function spreadPoint(array: number[][], position: [number, number], min: number, speed: number = 2) {
            if (!array) return;

            const positionTransparency = scene.getPositionTransparency(position);
            if (positionTransparency === 0) return;

            const [x, y] = position;
            if (y >= array.length || x >= array[y].length) return;

            const level = array[y][x];
            const originalNextLevel = level - speed;
            const nextLevel = Math.round(originalNextLevel * positionTransparency) | 0;
            speed = speed + (originalNextLevel - nextLevel)
            if (nextLevel <= min) return;

            for (let j = x - 1; j <= x + 1; j++)
                for (let i = y - 1; i <= y + 1; i++)
                    if ((j === x || i === y) && 
                        !(j === x && i === y) && 
                        (i >= 0 && i < array.length && j >= 0 && j < array[i].length) && 
                        (array[i][j] < nextLevel))
                    {
                        array[i][j] = nextLevel;
                        const nextPosition: [number, number] = [j, i];
                        
                        spreadPoint(array, nextPosition, min, speed);
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
        drawSnow();

        // sort objects by origin point
        this.level.objects.sort((a: SceneObject, b: SceneObject) => a.position[1] - b.position[1]);
        
        drawObjects(ctx, this.camera, this.level.objects);

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

        function drawTiles() {
            drawLayer(scene.level.tiles, cameraTransformation, c => c ? getCellAt(c.skin, 0, 0) : voidCell);
        }

        function drawSnow() {
            drawLayer(scene.level.tiles, cameraTransformation, c => getSnowCell(c?.snowLevel || 0));

            function getSnowCell(snowLevel: number): Cell | undefined {
                if (snowLevel === 0) {
                    return undefined;
                }

                return new Cell(' ', undefined, `#fff${(snowLevel * 2).toString(16)}`);
            }
        }

        function drawWeather() {
            // Currently is linked with camera, not the level.
            drawLayer(scene.level.weatherLayer, p => p, c => c);
        }

        function drawTemperatures() {
            drawDebugLayer(scene.level.temperatureLayer);
        }

        function drawMoisture() {
            drawDebugLayer(scene.level.moistureLayer);
        }

        function drawBlockedCells() {
            drawLayer(scene.level.blockedLayer, cameraTransformation, createCell);

            function createCell(b: boolean | undefined) {
                return b === true ? new Cell('⛌', `#f00c`, `#000c`) : undefined;
            }
        }

        function cameraTransformation(position: [number, number]) : [number, number] {
            const [x, y] = position;
            const top = scene.camera.position.top + y;
            const left = scene.camera.position.left + x;
            return [left, top];
        }

        function drawLayer<T>(
            layer: T[][], 
            transformation: (p: [number, number]) => [number, number], 
            cellFactory: (value: T | undefined) => Cell | undefined) {
        
            for (let y = 0; y < scene.camera.size.height; y++) {
                for (let x = 0; x < scene.camera.size.width; x++) {
                    const [left, top] = transformation([x, y]);
                    const value = (layer[top] && layer[top][left]);
                    const cell = cellFactory(value);
                    if (!cell) continue;

                    drawCell(ctx, scene.camera, cell, x, y);
                }
            }
        }

        function drawDebugLayer(layer: number[][], max: number = 15) {
            drawLayer(layer, cameraTransformation, createCell);

            function createCell(v: number | undefined) {
                const value = v || 0;
                return new Cell(value.toString(16), `rgba(128,128,128,0.5)`, numberToHexColor(value, max))
            }

            function numberToHexColor(val: number, max: number = 15): string {
                const intVal = Math.round(val) | 0;
                const red = Math.floor((intVal / max) * 255);
                const blue = 255 - red;
                const alpha = 0.2;
                return `rgba(${red}, 0, ${blue}, ${alpha})`;
            }
        }
    }

    isPositionValid(position: [number, number]) {
        const [aleft, atop] = position;
        return aleft >= 0 && atop >= 0 && aleft < this.level.width && atop < this.level.height;
    }

    isPositionBlocked(position: [number, number]) {
        const layer = this.level.blockedLayer;
        const [aleft, atop] = position;
        return (layer[atop] && layer[atop][aleft]) === true;
    }

    getPositionTransparency(position: [number, number]): number {
        const layer = this.level.transparencyLayer;
        const [aleft, atop] = position;
        const transparencyValue = (layer[atop] && layer[atop][aleft]) || 0;
        return (15 - transparencyValue) / 15;
    }

    private getActionsAt(position: [number, number]): ActionData[] {
        const scene = this;
        const actions: ActionData[] = [];
        for (const object of scene.objects) {
            if (!object.enabled) continue;
            //
            const [left, top] = position;
            //
            const pleft = left - object.position[0] + object.originPoint[0];
            const ptop = top - object.position[1] + object.originPoint[1];

            for (const action of object.actions) {
                const [aleft, atop] = action.position;
                if (aleft === pleft && 
                    atop === ptop) {
                    actions.push(this.convertToActionData(object, action));
                }
            }
        }

        return actions;
    }

    getNpcAt(position: [number, number]): Npc | undefined {
        for (let object of this.level.objects) {
            if (!object.enabled) continue;
            if (!(object instanceof Npc)) continue;
            //
            if (object.position[0] === position[0] && 
                object.position[1] === position[1]) {
                return object;
            }
        }
        return undefined;
    }

    getNpcInteraction(npc: Npc): ActionData | undefined {
        return this.getActionsAt(npc.cursorPosition).filter(x => x.type === "interaction")[0];
    }

    getNpcCollisionAction(npc: Npc): ActionData | undefined {
        return this.getActionsAt(npc.position).filter(x => x.type === "collision")[0];
    }

    getItemUsageAction(item: Item): ActionData | undefined {
        const interactions = item.actions.filter(x => x.type === "usage");
        if (interactions.length === 0) {
            return undefined;
        }

        // This is a default usage action.
        const defaultAction = interactions[0];
        return this.convertToActionData(item, defaultAction);
    }

    getTemperatureAt(position: [number, number]): number {
        return this.level?.temperatureLayer[position[1]]?.[position[0]] || 0;
    }

    getWeatherAt(position: [number, number]): string | undefined {
        const value = this.level?.roofHolesLayer[position[1]]?.[position[0]];
        const isHole = typeof value === "undefined" || value;
        if (!isHole && this.level?.weatherType !== "mist") {
            return undefined;
        }

        return this.level?.weatherType || undefined;
    }

    getTileAt(position: [number, number]): Tile | undefined {
        return this.level?.tiles?.[position[1]]?.[position[0]];
    }

    private convertToActionData(object: SceneObject, objectAction: ObjectAction): ActionData {
        const [ileft, itop] = objectAction.iconPosition;
        const actionIconChar = object.skin.grid[itop][ileft];
        const [fgColor, bgColor] = object.skin.raw_colors[itop] ? (object.skin.raw_colors[itop][ileft] || []) : [];
        const actionIcon = new Cell(actionIconChar, fgColor, bgColor);
        return { type: objectAction.type, object, action: objectAction.callback, actionIcon }; 
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

export type ActionData = {
    type: ObjectActionType,
    object: SceneObject,
    action: GameObjectAction,
    actionIcon: Cell,
};