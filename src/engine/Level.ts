import { Scene } from "./Scene";
import { WeatherType } from "./WeatherSystem";
import { Vector2 } from "./data/Vector2";
import { emitEvent } from "./events/EventLoop";
import { GameEvent } from "./events/GameEvent";
import { Cell } from "./graphics/Cell";
import { Particle } from "./objects/Particle";
import { SceneObject } from "./objects/SceneObject";
import { Tile } from "./objects/Tile";
import { SignalProcessor } from "./signaling/SignalProcessor";

export class Level {
    private _isLoaded = false;

    public blockedLayer: boolean[][] = [];
    public transparencyLayer: number[][] = [];
    public signalProcessor: SignalProcessor = new SignalProcessor(this);
    public lightLayer: number[][] = [];
    public lightColorLayer: [number, number, number][][] = [];
    public weatherTicks: number = 0;
    public temperatureTicks: number =  0;
    public temperatureLayer: number[][] = [];
    public moistureLayer: number[][] = [];
    public weatherParticles: Particle[] = [];
    public weatherLayer: Cell[][] = [];
    public cloudLayer: number[][] = [];
    public roofLayer: number[][] = [];
    public roofHolesLayer: boolean[][] = [];
    public particles: Particle[] = [];
    public weatherType: WeatherType = 'normal';
    public wind: Vector2 = Vector2.zero;
    public windTicks: number = 0;
    public ambientLightColor: [number, number, number] = [255, 255, 255];
    public portals: { [portal_id: string]: Vector2[] } = {};
    public size: Vector2;

    public get isWindy() {
        return this.wind.length !== 0;
    }

    constructor(
        public id: string,
        public objects: SceneObject[],
        public tiles: Tile[][]
    ) {
        const height = tiles.length;
        this.size = new Vector2(height > 0 ? tiles[0].length : 0, height);

        for (const object of objects) {
            object.bindToLevel(this);
        }
    }

    update(ticks: number, scene: Scene) {
        this.weatherTicks += ticks;
        this.windTicks += ticks;
        this.temperatureTicks += ticks;
    }

    onLoaded(scene: Scene) {
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

}