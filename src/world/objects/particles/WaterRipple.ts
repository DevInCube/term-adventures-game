import { Particle } from "../../../engine/objects/Particle";
import { waterRippleSprite } from "../../sprites/waterRippleSprite";

export class WaterRipple extends Particle {
    constructor(position: [number, number], state: number = 0) {
        super(waterRippleSprite, position, state, { decaySpeed: 200, });
        this.type = "waterripple";
    }
}
