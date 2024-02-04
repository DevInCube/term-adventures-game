import { Vector2 } from "../../../engine/math/Vector2";
import { rainDropSprite } from "../../sprites/rainDropSprite";
import { WeatherParticle } from "./WeatherParticle";

export class Raindrop extends WeatherParticle {
    constructor(position: Vector2, state: number = 0) {
        super(rainDropSprite, position, state);
        this.type = "raindrop";
    }

    protected onRemove(): void {
        const tile = this.parent?.scene!.tilesObject.getTileAt(this.globalPosition);
        tile?.addDisturbance();
    }
}
