import { Scene } from "./Scene";
import { WeatherType } from "./weather/WeatherType";
import { Vector2 } from "./math/Vector2";
import { emitEvent } from "./events/EventLoop";
import { GameEvent } from "./events/GameEvent";
import { Object2D } from "./objects/Object2D";
import { Tile } from "./objects/Tile";
import { SignalProcessor } from "./signaling/SignalProcessor";
import { Door } from "../world/objects/door";
import { Box2 } from "./math/Box2";
import { ActionData, convertToActionData } from "./ActionData";
import { SwitchGameModeGameEvent } from "../world/events/SwitchGameModeGameEvent";
import { TransferItemsGameEvent } from "../world/events/TransferItemsGameEvent";
import { Npc } from "./objects/Npc";
import { WeatherParticlesObject } from "./objects/special/WeatherParticlesObject";
import { ParticlesObject } from "./objects/special/ParticlesObject";
import { TilesObject } from "./objects/special/TilesObject";
import { BlockedLayerObject } from "./objects/special/BlockedLayerObject";
import { SignalsLayerObject } from "./objects/special/SignalsLayerObject";
import { NumberLayerObject } from "./objects/special/NumberLayerObject";
import { Color } from "./math/Color";
import { SkyLight } from "./lights/SkyLight";
import { clamp } from "../utils/math";
import { Lights } from "./lights/Lights";
import { Weather } from "./weather/Weather";

const defaultLightIntensityAtNight = 4;
const defaultLightIntensityAtDay = 15;

export class Level extends Scene {
    public isLevel = true;
    private _isLoaded = false;

    public lights: Lights = new Lights(this);
    public weather: Weather = new Weather(this);
    public roofLayer: number[][] = [];
    public roofHolesLayer: boolean[][] = [];
    public skyLight: SkyLight;
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
        return this.weather.wind.length !== 0;
    }
    
    get windBox(): Box2 {
        const margin = (this.weather.wind?.clone() || Vector2.zero).multiplyScalar(2);
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

        this.temperatureLayerObject = new NumberLayerObject(() => this.weather.temperatureLayer);
        this.temperatureLayerObject.visible = false;
        this.add(this.temperatureLayerObject);

        this.moistureLayerObject = new NumberLayerObject(() => this.weather.moistureLayer);
        this.moistureLayerObject.visible = false;
        this.add(this.moistureLayerObject);

        this.skyLight = new SkyLight(new Color(1, 1, 1), 15);
        this.add(this.skyLight);
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
        
        const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
        // 0.125 (1/8) so the least amount of sunlight is at 03:00
        const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
        scene.skyLight.intensity = clamp(defaultLightIntensityAtNight + Math.round(sunlightPercent * (defaultLightIntensityAtDay - defaultLightIntensityAtNight)), 0, 15); 
        this.weather.updateSunlight(sunlightPercent);

        this.lights.update();
        this.weather.update(ticks);

        if (!this.debugTickFreeze || this.debugTickStep > 0) {
            this.signalProcessor.update.bind(this.signalProcessor)(this);
            if (this.debugTickStep > 0) {
                this.debugTickStep -= 1;
            }
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
        emitEvent(new GameEvent("system", "weather_changed", { from: level.weather.weatherType, to: level.weather.weatherType }));
        emitEvent(new GameEvent("system", "wind_changed", { from: level.isWindy, to: level.isWindy }));

        this._isLoaded = true;
    }

    changeWeather(weatherType: WeatherType) {
        this.weather.changeWeather(weatherType);
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

    // TODO: move to some getWeatherInfo with weather type
    getTemperatureAt(position: Vector2): number {
        return this.weather.temperatureLayer[position.y]?.[position.x] || 0;
    }

    getWeatherAt(position: Vector2): string | undefined {
        return this.weather.getWeatherAt(position);
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
