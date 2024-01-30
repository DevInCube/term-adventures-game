import { createWeatherParticle } from "../../weather/WeatherHelper";
import { Vector2 } from "../../math/Vector2";
import { Object2D } from "../Object2D";
import { Particle } from "../Particle";

export class WeatherParticlesObject extends Object2D {
    private weatherTicks: number = 0;

    constructor() {
        super();
        this.type = "weather_particles";
    }

    update(ticks: number): void {
        super.update(ticks);
        this.weatherTicks += ticks;

        for (const particle of this.children) {
            particle.update(ticks);
        }

        const weatherTicksOverflow = this.weatherTicks - 300;
        if (weatherTicksOverflow >= 0) {
            this.updateWeatherParticles();
            this.weatherTicks = weatherTicksOverflow;
        }
    }

    public getWeatherParticleAt(position: Vector2): Particle | undefined {
        const child = this.children.find(p => p.position.equals(position));
        return child ? child as Particle : undefined; 
    }

    private updateWeatherParticles() {
        const box = this.scene!.windBox;
        const weatherType = this.scene!.weather.weatherType;
        for (let y = box.min.y; y < box.max.y; y++) {
            for (let x = box.min.x; x < box.max.x; x++) {
                const levelPosition = new Vector2(x, y);
                if (!this.scene!.isRoofHoleAt(levelPosition)) {
                    continue;
                }
                
                const existingParticle = this.getWeatherParticleAt(levelPosition); 
                if (existingParticle) {
                    continue;
                }
                
                const newParticle = createWeatherParticle(weatherType, levelPosition);
                if (!newParticle) {
                    continue;
                }

                this.add(newParticle);
            }
        }
    }
}
