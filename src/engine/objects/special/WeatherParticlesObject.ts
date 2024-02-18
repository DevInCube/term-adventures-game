import { createWeatherParticle } from "../../weather/WeatherHelper";
import { Vector2 } from "../../math/Vector2";
import { Object2D } from "../Object2D";
import { ParticlesObject } from "./ParticlesObject";

export class WeatherParticlesObject extends ParticlesObject {
    private weatherTicks: number = 0;

    constructor() {
        super();
        this.type = "weather_particles";
    }

    update(ticks: number): void {
        super.update(ticks);

        this.weatherTicks = Object2D.updateValue(this.weatherTicks, ticks, 300, () => {
            this.updateWeatherParticles();
        });
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
                
                const existingParticle = this.getParticleAt(levelPosition); 
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
