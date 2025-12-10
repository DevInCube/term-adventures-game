import { ThunderDamageEffect } from "../../../engine/effects/DamageEffect";
import { Vector2 } from "../../../engine/math/Vector2";
import { Particle } from "../../../engine/objects/Particle";
import { thunderBoltSprite } from "../../sprites/thunderBoltSprite";

export class ThunderBolt extends Particle {
    isWeatherParticle = true;
    weatherType = "storm";

    constructor(position: Vector2, state: number = 0) {
        super(thunderBoltSprite, position, state, { decaySpeed: 100, origin: new Vector2(0, 3) });
        this.type = "thunder_bolt";
        this.isMovableByWind = false;
        this.physics.light('f');
        this.hostEffects.push(new ThunderDamageEffect());
    }
}
