import { fillLayer } from "../../utils/layer";
import { Level } from "../Level";
import { emitEvent } from "../events/EventLoop";
import { GameEvent } from "../events/GameEvent";
import { Vector2 } from "../math/Vector2";
import { getWeatherSkyTransparency } from "./WeatherHelper";
import { WeatherType } from "./WeatherType";

export class Weather {
    public weatherType: WeatherType = 'normal';
    public cloudLayer: number[][] = [];
    public wind: Vector2 = Vector2.zero;
    public windTicks: number = 0;
    
    constructor(private scene: Level) {

    }

    update(ticks: number) {
        this.windTicks += ticks;

        this.updateWeather();
    }

    public getWeatherAt(position: Vector2): string | undefined {
        const value = this.scene.roofHolesLayer[position.y]?.[position.x];
        const isHole = typeof value === "undefined" || value;
        if (!isHole && this.weatherType !== "mist" && this.weatherType !== "heavy_mist") {
            return undefined;
        }

        return this.weatherType || undefined;
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

    private updateWeather() {
        this.cloudLayer = fillLayer(this.scene.size, 15 - Math.round(15 * getWeatherSkyTransparency(this.weatherType)) | 0);
        // TODO: implement random noise clouds.

        const windTicksOverflow = this.windTicks - 1000;
        if (windTicksOverflow >= 0) {
            this.updateWeatherWind();
            this.windTicks = windTicksOverflow;
        }
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
}