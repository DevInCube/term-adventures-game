import { Vector2 } from "../../../engine/math/Vector2";
import { snowFlakeSprite } from "../../sprites/snowFlakeSprite";
import { WeatherParticle } from "./WeatherParticle";

export class Snowflake extends WeatherParticle {
    constructor(position: Vector2, state: number = 0) {
        super(snowFlakeSprite, position, state);
        this.type = "snowflake";
    }

    protected onRemove(): void {
        const tile = this.parent?.scene!.tilesObject.getTileAt(this.getWorldPosition(new Vector2()));
        tile?.addDisturbance();
        tile?.increaseSnow();
    }
}
