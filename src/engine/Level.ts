import { Scene } from "./Scene";
import { WeatherType, getWeatherSkyTransparency } from "./WeatherSystem";
import { Vector2 } from "./math/Vector2";
import { emitEvent } from "./events/EventLoop";
import { GameEvent } from "./events/GameEvent";
import { Object2D } from "./objects/Object2D";
import { Tile } from "./objects/Tile";
import { SignalProcessor } from "./signaling/SignalProcessor";
import { Door } from "../world/objects/door";
import { Box2 } from "./math/Box2";
import { mixColors } from "../utils/color";
import { ActionData, convertToActionData } from "./ActionData";
import * as utils from "./../utils/layer";
import { SwitchGameModeGameEvent } from "../world/events/SwitchGameModeGameEvent";
import { TransferItemsGameEvent } from "../world/events/TransferItemsGameEvent";
import { Npc } from "./objects/Npc";
import { WeatherParticlesObject } from "./objects/special/WeatherParticlesObject";
import { ParticlesObject } from "./objects/special/ParticlesObject";
import { TilesObject } from "./objects/special/TilesObject";
import { BlockedLayerObject } from "./objects/special/BlockedLayerObject";
import { SignalsLayerObject } from "./objects/special/SignalsLayerObject";
import { NumberLayerObject } from "./objects/special/NumberLayerObject";

const defaultLightLevelAtNight = 4;
const defaultLightLevelAtDay = 15;
const defaultTemperatureAtNight = 4;  // @todo depends on biome.
const defaultTemperatureAtDay = 7; // @todo depends on biome.
const defaultMoisture = 5;  // @todo depends on biome.

export class Level extends Scene {
    public isLevel = true;
    private _isLoaded = false;

    public transparencyLayer: number[][] = [];
    public lightLayer: number[][] = [];
    public lightColorLayer: [number, number, number][][] = [];
    public temperatureTicks: number =  0;
    public temperatureLayer: number[][] = [];
    public moistureLayer: number[][] = [];
    public cloudLayer: number[][] = [];
    public roofLayer: number[][] = [];
    public roofHolesLayer: boolean[][] = [];
    public weatherType: WeatherType = 'normal';
    public wind: Vector2 = Vector2.zero;
    public windTicks: number = 0;
    public ambientLightColor: [number, number, number] = [255, 255, 255];

    public tilesObject: TilesObject;
    public particlesObject: ParticlesObject;
    public weatherObject: WeatherParticlesObject;
    public blockedLayerObject: BlockedLayerObject;
    public signalsLayerObject: SignalsLayerObject;
    public temperatureLayerObject: NumberLayerObject;
    public moistureLayerObject: NumberLayerObject;
    public signalProcessor: SignalProcessor = new SignalProcessor(this);
    public size: Vector2;
    public gameTime = 0;
    public ticksPerDay: number = 120000;
    public globalLightLevel: number = 0;
    public globalTemperature: number = 7;
    public globalMoisture: number = defaultMoisture;
    public debugDisableGameTime: boolean = false;
    public debugTickFreeze: boolean = false;
    public debugTickStep: number = 0;

    public get portals(): { [portal_id: string]: Vector2[] } {
        const doors = this.children.filter(x => x.type === "door") as Door[];
        const map: { [id: string]: Vector2[] } = {};
        for (const door of doors) {
            if (!map[door.name]) {
                map[door.name] = [];
            }

            map[door.name].push(door.position);
        }

        return map;
    }
    
    get box(): Box2 {
        return new Box2(Vector2.zero, (this.size?.clone() || Vector2.zero).sub(new Vector2(1, 1)));
    }

    public get isWindy() {
        return this.wind.length !== 0;
    }
    
    get windBox(): Box2 {
        const margin = (this.wind?.clone() || Vector2.zero).multiplyScalar(2);
        return this.box.clone().expandByVector(margin);
    } 

    constructor(
        id: string,
        objects: Object2D[],
        tiles: Tile[][]
    ) {
        super();
        
        this.name = id;

        const height = tiles.length;
        this.size = new Vector2(height > 0 ? tiles[0].length : 0, height);

        this.tilesObject = new TilesObject(tiles);
        this.add(this.tilesObject);

        for (const object of objects) {
            this.add(object);
        }

        this.particlesObject = new ParticlesObject();
        this.add(this.particlesObject);

        this.weatherObject = new WeatherParticlesObject();
        this.add(this.weatherObject);

        this.blockedLayerObject = new BlockedLayerObject();
        this.blockedLayerObject.visible = false;
        this.add(this.blockedLayerObject);

        this.signalsLayerObject = new SignalsLayerObject();
        this.signalsLayerObject.visible = false;
        this.add(this.signalsLayerObject);

        this.temperatureLayerObject = new NumberLayerObject(() => this.temperatureLayer);
        this.temperatureLayerObject.visible = false;
        this.add(this.temperatureLayerObject);

        this.moistureLayerObject = new NumberLayerObject(() => this.moistureLayer);
        this.moistureLayerObject.visible = false;
        this.add(this.moistureLayerObject);
    }

    handleEvent(ev: GameEvent): void {
        if (ev.type === "user_action" && ev.args.subtype === "npc_talk") {
            emitEvent(SwitchGameModeGameEvent.create("scene", "dialog"));
        } else if (ev.type === TransferItemsGameEvent.type) {
            const args = <TransferItemsGameEvent.Args>ev.args;
            args.recipient.inventory.addItems(args.items);
            console.log(`${args.recipient.type} received ${args.items.length} items.`);
        }
    }

    update(ticks: number) {
        super.update(ticks);
        const scene = this;
        
        if (!this.debugDisableGameTime) {
            this.gameTime += ticks;
        }

        this.windTicks += ticks;
        this.temperatureTicks += ticks;
        
        const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
        // 0.125 (1/8) so the least amount of sunlight is at 03:00
        const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
        scene.globalLightLevel = defaultLightLevelAtNight + Math.round(sunlightPercent * (defaultLightLevelAtDay - defaultLightLevelAtNight)); 
        scene.globalTemperature = defaultTemperatureAtNight + Math.round(sunlightPercent * (defaultTemperatureAtDay - defaultTemperatureAtNight));

        updateTransparency();
        updateLights();
        updateWeather();
        updateTemperature();
        updateMoisture();

        if (!this.debugTickFreeze || this.debugTickStep > 0) {
            this.signalProcessor.update.bind(this.signalProcessor)(this);
            if (this.debugTickStep > 0) {
                this.debugTickStep -= 1;
            }
        }


        function updateTransparency() {
            const transparencyLayer: number[][] = [];
            fillLayer(transparencyLayer, 0);
            for (const object of scene.children) {
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
            scene.transparencyLayer = transparencyLayer;
        }

        function updateWeather() {
            scene.cloudLayer = [];
            fillLayer(scene.cloudLayer, 15 - Math.round(15 * getWeatherSkyTransparency(scene.weatherType)) | 0);
            // TODO: implement random noise clouds.

            const windTicksOverflow = scene.windTicks - 1000;
            if (windTicksOverflow >= 0) {
                updateWeatherWind();
                scene.windTicks = windTicksOverflow;
            }
            
            function updateWeatherWind() {
                // Push weather particles with wind direction.
                for (const particle of scene.weatherObject.children) {
                    particle.position.add(scene.wind);
                }

                // Remove weather particles out of level bounds (+border).
                for (const particle of scene.weatherObject.children) {
                    if (!scene.windBox.containsPoint(particle.position)) {
                        scene.weatherObject.remove(particle);
                    }
                }

                // Push particles with wind direction.
                for (const particle of scene.particlesObject.children) {
                    particle.position.add(scene.wind);
                }

                // Remove particles out of level bounds (+border).
                for (const particle of scene.particlesObject.children) {
                    if (!scene.windBox.containsPoint(particle.position)) {
                        scene.particlesObject.remove(particle);
                    }
                }
            }
        }

        type LightLayer = {
            lights: number[][],
            color: [number, number, number],
        };

        function updateLights() {
            // clear
            scene.lightLayer = [];
            fillLayer(scene.lightLayer, 0);
            
            scene.lightColorLayer = [];
            fillLayer(scene.lightColorLayer, null);

            const ambientLayer: number[][] = [];
            fillLayer(ambientLayer, 0);

            const maxValue = 15;
            for (let y = 0; y < scene.size.height; y++) {
                for (let x = 0; x < scene.size.width; x++) {
                    const cloudValue = scene.cloudLayer[y]?.[x] || 0;
                    const roofValue = scene.roofLayer[y]?.[x] || 0;
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
            lightLayers.push({ lights: ambientLayer, color: scene.ambientLightColor, });

            const lightObjects = [...scene.children];

            for (const obj of lightObjects) {
                if (!obj.enabled) continue;

                lightLayers.push(...getObjectLightLayers(obj));
                for (const child of obj.children) {
                    lightLayers.push(...getObjectLightLayers(child));
                }
            }

            mergeLightLayers(lightLayers);
        }

        function getObjectLightLayers(obj: Object2D): LightLayer[] {
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

        function getLightIntensityAndColor(obj: Object2D, char: string) {
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

            for (let y = 0; y < scene.lightLayer.length; y++) {
                for (let x = 0; x < scene.lightLayer[y].length; x++) {
                    const colors: { color:[number, number, number], intensity: number }[] = lightLayers
                        .map(layer => ({ color: layer.color, intensity: layer.lights[y][x] }))
                        .filter(x => x.color && x.intensity);
                    const intensity = colors.map(x => x.intensity).reduce((a, x) => a += x, 0) | 0;
                    //const intensity = Math.max(...colors.map(x => x.intensity));
                    scene.lightLayer[y][x] = Math.min(15, Math.max(0, intensity)); 
                    scene.lightColorLayer[y][x] = mixColors(colors);
                }
            }
        }

        function updateTemperature() {
            if (scene.temperatureLayer.length === 0) {
                scene.temperatureLayer = [];
                fillLayer(scene.temperatureLayer, scene.globalTemperature);
            }

            if (scene.temperatureTicks > 1000) {
                scene.temperatureTicks = 0;
                // Cool down step.
                for (let y = 0; y < scene.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.temperatureLayer[y].length; x++) {
                        // cool down slower than warm up.
                        scene.temperatureLayer[y][x] -= 1;
                    }
                }

                // iterate temp points (sources) in objects
                const temperatureObjects = [...scene.children];
                for (const obj of temperatureObjects) {
                    if (!obj.enabled) continue;

                    addObjectTemperature(obj);
                    for (const child of obj.children) {
                        addObjectTemperature(child);
                    }
                }

                var newTemperatureLayer: number[][] = [];
                fillLayer(newTemperatureLayer, scene.globalTemperature);
                for (let y = 0; y < scene.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.temperatureLayer[y].length; x++) {
                        const layerPos = new Vector2(x, y);
                        meanPoint(scene.temperatureLayer, newTemperatureLayer, layerPos);
                    }
                }
                scene.temperatureLayer = newTemperatureLayer;

                for (let y = 0; y < scene.temperatureLayer.length; y++) {
                    for (let x = 0; x < scene.temperatureLayer[y].length; x++) {
                        if (scene.temperatureLayer[y][x] < scene.globalTemperature) {
                            scene.temperatureLayer[y][x] = scene.globalTemperature;
                        }
                    }
                }
            }
        }

        function addObjectTemperature(obj: Object2D) {
            for (const [top, string] of obj.physics.temperatures.entries()) {
                for (const [left, char] of string.split('').entries()) {
                    const temperature = Number.parseInt(char, 16);
                    const charPos = new Vector2(left, top);
                    const position = obj.position.clone().sub(obj.originPoint).add(charPos);
                    if (!scene.isPositionValid(position)) {
                        continue;
                    }
                    
                    addEmitter(scene.temperatureLayer, position, temperature);
                }
            }
        }

        function fillLayer<T>(layer: T[][], defaultValue: T) {
            const size = scene.size;
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
            speed = speed + (originalNextLevel - nextLevel);
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
                        nextPosition.y >= array.length ||
                        nextPosition.x < 0 ||
                        nextPosition.x >= array[0].length) {
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
            // TODO: check water tiles.
            scene.moistureLayer = [];
            fillLayer(scene.moistureLayer, scene.globalMoisture);
        }
    }

    isRoofHoleAt(pos: Vector2): boolean {
        let roofHoleVal = this.roofHolesLayer[pos.y]?.[pos.x];
        return roofHoleVal || typeof roofHoleVal === "undefined";
    }

    isPositionValid(position: Vector2) {
        return this.box.containsPoint(position);
    }

    isPositionBlocked(position: Vector2) {
        return this.blockedLayerObject.isPositionBlocked(position);
    }

    getPositionTransparency(position: Vector2): number {
        const layer = this.transparencyLayer;
        const transparencyValue = layer[position.y]?.[position.x] || 0;
        return (15 - transparencyValue) / 15;
    }

    getActionsAt(position: Vector2): ActionData[] {
        const scene = this;
        const actions: ActionData[] = [];
        for (const object of scene.children) {
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

    onLoaded() {
        if (this._isLoaded) {
            return;
        }

        // Emit initial level events.
        const level = this;
        emitEvent(new GameEvent("system", "weather_changed", { from: level.weatherType, to: level.weatherType }));
        emitEvent(new GameEvent("system", "wind_changed", { from: level.isWindy, to: level.isWindy }));

        this._isLoaded = true;
    }

    changeWeather(weatherType: WeatherType) {
        const oldWeatherType = this.weatherType;
        this.weatherType = weatherType;
        if (oldWeatherType !== this.weatherType) {
            emitEvent(new GameEvent(
                "system", 
                "weather_changed", 
                {
                    from: oldWeatherType,
                    to: this.weatherType,
                }));
        }
    } 

    
    getNpcAt(position: Vector2): Npc | undefined {
        for (let object of this.children) {
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
        return this.temperatureLayer[position.y]?.[position.x] || 0;
    }

    getLightAt(position: Vector2): number {
        return this.lightLayer[position.y]?.[position.x] || 0;
    }

    getWeatherAt(position: Vector2): string | undefined {
        const value = this.roofHolesLayer[position.y]?.[position.x];
        const isHole = typeof value === "undefined" || value;
        if (!isHole && this.weatherType !== "mist" && this.weatherType !== "heavy_mist") {
            return undefined;
        }

        return this.weatherType || undefined;
    }

    // debug
    public get debugDrawBlockedCells(): boolean {
        return this.blockedLayerObject.visible;
    }

    public set debugDrawBlockedCells(value: boolean) {
        this.blockedLayerObject.visible = value;
    }

    public get debugDrawSignals(): boolean {
        return this.signalsLayerObject.visible;
    }

    public set debugDrawSignals(value: boolean) {
        this.signalsLayerObject.visible = value;
    }

    public get debugDrawTemperatures(): boolean {
        return this.temperatureLayerObject.visible;
    }

    public set debugDrawTemperatures(value: boolean) {
        this.temperatureLayerObject.visible = value;
    }

    public get debugDrawMoisture(): boolean {
        return this.moistureLayerObject.visible;
    }

    public set debugDrawMoisture(value: boolean) {
        this.moistureLayerObject.visible = value;
    }
}
