import { Scene } from "../../../engine/Scene";
import { Vector2 } from "../../../engine/math/Vector2";
import { fallingAshSprite } from "../../sprites/fallingAshSprite";
import { WeatherParticle } from "./WeatherParticle";

export class FallingAsh extends WeatherParticle {
    constructor(position: Vector2, state: number = 0) {
        super(fallingAshSprite, position, state);
        this.type = "falling_ash";
    }

    protected onRemove(scene: Scene): void {
        super.onRemove(scene);
        const tile = scene.getTileAt(this.position);
        tile?.addDisturbance();
    }
}
