import { Scene } from "../../../engine/Scene";
import { Vector2 } from "../../../engine/data/Vector2";
import { Sprite } from "../../../engine/data/Sprite";
import { Particle } from "../../../engine/objects/Particle";

export class WeatherParticle extends Particle {
    static DefaultDecaySpeed = 300;

    constructor(sprite: Sprite, position: Vector2, state: number = 0) {
        super(sprite, position, state, {
            decaySpeed: WeatherParticle.DefaultDecaySpeed,
        });
    }

    protected onRemove(scene: Scene): void {
        scene.removeWeatherParticle(this);
    }
}
