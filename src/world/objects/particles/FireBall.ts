import { FireDamageEffect } from "../../../engine/effects/DamageEffect";
import { Vector2 } from "../../../engine/math/Vector2";
import { Particle } from "../../../engine/objects/Particle";
import { fireBallSprite } from "../../sprites/fireBallSprite";

export class FireBall extends Particle {
    constructor(position: Vector2, state: number = 0) {
        super(fireBallSprite, position, state, { decaySpeed: 100 });
        this.type = "fire_ball";
        this.physics.light('f').temperature('f');
        this.hostEffects.push(new FireDamageEffect());
    }
}
