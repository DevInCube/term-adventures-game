import { FireDamageEffect } from "../../../engine/effects/DamageEffect";
import { Vector2 } from "../../../engine/math/Vector2";
import { fireBallSprite } from "../../sprites/fireBallSprite";
import { WeatherParticle } from "./WeatherParticle";

export class FireBall extends WeatherParticle {
    constructor(position: Vector2, state: number = 0) {
        super(fireBallSprite, position, state);
        this.type = "fire_ball";
        this.physics.light('f').temperature('f');
        this.hostEffects.push(new FireDamageEffect());
    }
}
