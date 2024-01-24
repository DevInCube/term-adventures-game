import { Scene } from "../../../engine/Scene";
import { Vector2 } from "../../../engine/data/Vector2";
import { snowFlakeSprite } from "../../sprites/snowFlakeSprite";
import { WeatherParticle } from "./WeatherParticle";

export class Snowflake extends WeatherParticle {
    constructor(position: Vector2, state: number = 0) {
        super(snowFlakeSprite, position, state);
        this.type = "snowflake";
    }

    protected onRemove(scene: Scene): void {
        super.onRemove(scene);
        const tile = scene.getTileAt(this.position);
        tile?.addDisturbance();
        tile?.increaseSnow();
    }
}
