import { Vector2 } from "../../../engine/math/Vector2";
import { Particle } from "../../../engine/objects/Particle";
import { waterRippleSprite } from "../../sprites/waterRippleSprite";

export class WaterRipple extends Particle {
    constructor(position: Vector2, state: number = 0) {
        super(waterRippleSprite, position, state, { decaySpeed: 200, });
        this.type = "waterripple";
    }
}
