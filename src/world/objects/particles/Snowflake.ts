import { Scene } from "../../../engine/Scene";
import { Particle } from "../../../engine/objects/Particle";
import { snowFlakeSprite } from "../../sprites/snowFlakeSprite";

export class Snowflake extends Particle {
    constructor(position: [number, number], state: number = 0) {
        super(snowFlakeSprite, position, state, {
            decaySpeed: 300,
        });
        this.type = "snowflake";
    }

    protected onRemove(scene: Scene): void {
        const tile = scene.getTileAt(this.position);
        tile?.increaseSnow();
    }
}
