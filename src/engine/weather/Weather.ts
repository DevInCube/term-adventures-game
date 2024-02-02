import { Level } from "../Level";
import { emitEvent } from "../events/EventLoop";
import { GameEvent } from "../events/GameEvent";
import { Vector2 } from "../math/Vector2";
import { getWeatherSkyTransparency } from "./WeatherHelper";
import { WeatherType } from "./WeatherType";
import { Object2D } from "../objects/Object2D";
import { TemperatureInfo } from "../components/ObjectPhysics";
import { clamp } from "../../utils/math";
import { Grid } from "../math/Grid";

const defaultLightIntensityAtNight = 4;
const defaultLightIntensityAtDay = 15;

// TODO: depend on biome.
const defaultTemperatureAtNight = 4;
const defaultTemperatureAtDay = 7;
const defaultMoisture = 5;

export type WeatherInfo = {
    weatherType: WeatherType,
    temperature: number,
};

export class Weather {
    public globalTemperature: number = 7;
    public globalMoisture: number = defaultMoisture;
    public ticksPerDay: number = 120000;

    public gameTime = 0;
    public weatherType: WeatherType = 'normal';
    public cloudLayer: Grid<number>;
    public wind: Vector2 = Vector2.zero;
    public windTicks: number = 0;
    public temperatureTicks: number =  0;
    public temperatureLayer: Grid<number>;
    public moistureLayer: Grid<number>;

    constructor(private scene: Level) {
        this.cloudLayer = new Grid<number>(scene.size);
        this.temperatureLayer = new Grid<number>(scene.size).fillValue(this.globalTemperature);
        this.moistureLayer = new Grid<number>(scene.size).fillValue(this.globalMoisture);
    }

    update(ticks: number) {
        if (!this.scene.debugDisableGameTime) {
            this.gameTime += ticks;
        }

        const timeOfTheDay = (this.gameTime % this.ticksPerDay) / this.ticksPerDay; // [0..1), 0 - midnight
        // 0.125 (1/8) so the least amount of sunlight is at 03:00
        const sunlightPercent = Math.min(1, Math.max(0, 0.5 + Math.cos(2 * Math.PI * (timeOfTheDay + 0.5 - 0.125))));
        this.scene.skyLight.intensity = clamp(defaultLightIntensityAtNight + Math.round(sunlightPercent * (defaultLightIntensityAtDay - defaultLightIntensityAtNight)), 0, 15); 
        this.globalTemperature = defaultTemperatureAtNight + Math.round(sunlightPercent * (defaultTemperatureAtDay - defaultTemperatureAtNight));

        this.updateWeather(ticks);
        this.updateTemperature(ticks);
        this.updateMoisture();
    }

    public getWeatherInfoAt(position: Vector2): WeatherInfo {
        const weatherType = this.getWeatherTypeAt(position) || "normal";
        const temperature = this.temperatureLayer.at(position) || 0;
        return { weatherType, temperature};
    }

    public changeWeather(weatherType: WeatherType) {
        const oldWeatherType = this.weatherType;
        this.weatherType = weatherType;
        if (oldWeatherType !== this.weatherType) {
            // TODO: create types for this.
            emitEvent(new GameEvent(
                "system", 
                "weather_changed", 
                {
                    from: oldWeatherType,
                    to: this.weatherType,
                }));
        }
    }

    private getWeatherTypeAt(position: Vector2): WeatherType | undefined {
        const value = this.scene.roofHolesLayer.at(position);
        const isHole = typeof value === "undefined" || value;
        if (!isHole && this.weatherType !== "mist" && this.weatherType !== "heavy_mist") {
            return undefined;
        }

        return this.weatherType || undefined;
    }

    private updateWeather(ticks: number) {
        const defaultWeatherTransparency = getWeatherSkyTransparency(this.weatherType);
        this.cloudLayer.fillValue(15 - Math.round(15 * defaultWeatherTransparency) | 0);
        // TODO: implement random noise clouds.

        this.windTicks = Object2D.updateValue(this.windTicks, ticks, 1000, () => {
            this.updateWeatherWind();
        });
    }

    private updateWeatherWind() {
        const scene = this.scene;

        // Push weather particles with wind direction.
        for (const particle of scene.weatherObject.children) {
            particle.position.add(this.wind);
        }

        // Remove weather particles out of level bounds (+border).
        for (const particle of scene.weatherObject.children) {
            if (!scene.windBox.containsPoint(particle.position)) {
                scene.weatherObject.remove(particle);
            }
        }

        // Push particles with wind direction.
        for (const particle of scene.particlesObject.children) {
            particle.position.add(this.wind);
        }

        // Remove particles out of level bounds (+border).
        for (const particle of scene.particlesObject.children) {
            if (!scene.windBox.containsPoint(particle.position)) {
                scene.particlesObject.remove(particle);
            }
        }
    }

    private updateTemperature(ticks: number) {
        this.temperatureTicks = Object2D.updateValue(this.temperatureTicks, ticks, 1000, () => {
            // TODO: implement cold objects that can cooldown faster.
            this.updateCoolDown();

            const objects: Object2D[] = [];
            this.scene.traverse(x => objects.push(x));
            this.updateHeatUp(objects);
        });
    }

    private updateCoolDown() {
        this.temperatureLayer.traverse((value, pos, layer) => layer.setAt(pos, value - 1));
    }

    private updateHeatUp(objects: Object2D[]) {
        const temperatures = objects.flatMap(x => this.getObjectTemperatures(x));
        for (const { position, temperature } of temperatures) {
            this.addEmitter(this.temperatureLayer, position, temperature);
        }

        var newTemperatureLayer = new Grid<number>(this.scene.size).fillValue(this.globalTemperature);
        this.temperatureLayer.traverse((_, position) => {
            this.meanPoint(this.temperatureLayer, newTemperatureLayer, position);
        })

        this.temperatureLayer = newTemperatureLayer;

        this.temperatureLayer.traverse((v, pos, grid) => {
            if (v < this.globalTemperature) {
                grid.setAt(pos, this.globalTemperature);
            }
        });
    }

    private meanPoint(array: Grid<number>, newArray: Grid<number>, position: Vector2, decay: number = 2) {
        if (!array) {
            return;
        }

        const [x, y] = position;
        if (y >= array.height || x >= array.width) {
            return;
        }

        let maxValue = array.at(position);
        for (let i = Math.max(0, y - 1); i <= Math.min(array.height - 1, y + 1); i++) {
            for (let j = Math.max(0, x - 1); j <= Math.min(array.width - 1, x + 1); j++) {
                const pos = new Vector2(j, i);
                if ((i === y || j === x) && 
                    !(i === y && j === x) &&
                    array.at(pos) > maxValue
                ) {
                    maxValue = array.at(pos);
                }
            }
        }
        
        const newValue = Math.max(array.at(position), maxValue - decay);
        newArray.setAt(position, newValue); 
    }

    private getObjectTemperatures(obj: Object2D): TemperatureInfo[] {
        const objectTemperatures = obj.physics.temperatures;
        return objectTemperatures.map(x => ({...x, position: obj.position.clone().sub(obj.originPoint).add(x.position)}));
    }

    private addEmitter(layer: Grid<number>, position: Vector2, level: number) {
        const value = layer.at(position);
        if (typeof value !== "undefined" &&
            value < level
        ) {
            layer.setAt(position, level);
        }
    }

    private updateMoisture() {
        // TODO: check water tiles.
    }
}