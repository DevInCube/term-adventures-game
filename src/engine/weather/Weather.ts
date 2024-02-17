import { Level } from "../Level";
import { emitEvent } from "../events/EventLoop";
import { Vector2 } from "../math/Vector2";
import { getWeatherSkyTransparency } from "./WeatherHelper";
import { WeatherType } from "./WeatherType";
import { Object2D } from "../objects/Object2D";
import { TemperatureInfo } from "../components/ObjectPhysics";
import { clamp } from "../../utils/math";
import { Grid } from "../math/Grid";
import { WeatherChangedGameEvent } from "../../world/events/WeatherChangedGameEvent";

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

const _position = new Vector2();

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
            emitEvent(WeatherChangedGameEvent.create(oldWeatherType, this.weatherType));
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
            if (!scene.windBox.containsPoint(particle.getWorldPosition(_position))) {
                scene.weatherObject.remove(particle);
            }
        }

        // Push particles with wind direction.
        for (const particle of scene.particlesObject.children) {
            particle.position.add(this.wind);
        }

        // Remove particles out of level bounds (+border).
        for (const particle of scene.particlesObject.children) {
            if (!scene.windBox.containsPoint(particle.getWorldPosition(_position))) {
                scene.particlesObject.remove(particle);
            }
        }
    }

    private updateTemperature(ticks: number) {
        this.temperatureTicks = Object2D.updateValue(this.temperatureTicks, ticks, 1000, () => {
            this.updateNormalize();

            const objects: Object2D[] = [];
            this.scene.traverse(x => objects.push(x));
            this.updateDeviate(objects);
        });
    }

    private updateNormalize() {
        this.temperatureLayer.traverse((value, pos, layer) => {
            const direction = -Math.sign(value - this.globalTemperature);
            layer.setAt(pos, value + direction);
        });
    }

    private createTemperatureSources(objects: Object2D[]): { position: Vector2, temperature: number }[] {
        const temperatures = objects.flatMap(x => this.getObjectTemperatures(x));
        const temperatureSourceMap = new Map<number, { position: Vector2, temperature: number }>();
        for (const { position, temperature } of temperatures) {
            const key = position.x + 10000 * position.y;
            if (!temperatureSourceMap.has(key)) {
                temperatureSourceMap.set(key, { position, temperature: 0 });
            }

            const item = temperatureSourceMap.get(key);
            if (!item) {
                continue;
            }
            
            item.temperature = Math.max(item.temperature, temperature);
        }

        return [...temperatureSourceMap.values()];
    }

    private updateDeviate(objects: Object2D[]) {
        const sources = this.createTemperatureSources(objects);
        for (const { position, temperature } of sources) {
            this.temperatureLayer.setAt(position, temperature);
        }

        const newTemperatureLayer = new Grid<number>(this.scene.size).fillValue(this.globalTemperature);
        this.temperatureLayer.traverse((_, position) => {
            const newValue = this.meanPoint(this.temperatureLayer, position);
            newTemperatureLayer.setAt(position, newValue); 
        })

        for (const { position, temperature } of sources) {
            newTemperatureLayer.setAt(position, temperature);
        }

        this.temperatureLayer = newTemperatureLayer;
    }

    private meanPoint(
        array: Grid<number>,
        position: Vector2,
    ) {
        let sum = 0;
        let counter = 0;
        const [x, y] = position;
        const pos = new Vector2();
        for (pos.y = Math.max(0, y - 1); pos.y <= Math.min(array.height - 1, y + 1); pos.y++) {
            for (pos.x = Math.max(0, x - 1); pos.x <= Math.min(array.width - 1, x + 1); pos.x++) {
                if (!(pos.y === y || pos.x === x)) {
                    continue;
                }

                const value = array.at(pos);
                if (typeof value === "undefined") {
                    continue;
                }

                sum += value;
                counter += 1;
            }
        }

        const meanValue = Math.round(sum / counter) | 0;
        return meanValue;
    }

    private getObjectTemperatures(obj: Object2D): TemperatureInfo[] {
        const objectTemperatures = obj.physics.temperatures;
        return objectTemperatures.map(x => ({...x, position: obj.getWorldPosition(new Vector2()).sub(obj.originPoint).add(x.position)}));
    }

    private updateMoisture() {
        // TODO: check water tiles.
    }
}