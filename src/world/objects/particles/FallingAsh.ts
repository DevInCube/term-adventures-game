import { Vector2 } from "../../../engine/math/Vector2";
import { fallingAshSprite } from "../../sprites/fallingAshSprite";
import { WeatherParticle } from "./WeatherParticle";

export class FallingAsh extends WeatherParticle {
    constructor(position: Vector2, state: number = 0) {
        super(fallingAshSprite, position, state);
        this.type = "falling_ash";
    }

    protected onRemove(): void {
        const tile = this.parent?.scene!.tilesObject.getTileAt(this.getWorldPosition(new Vector2()));
        tile?.addDisturbance();
    }
}
