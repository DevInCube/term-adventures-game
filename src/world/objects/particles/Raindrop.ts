import { Sprite } from "../../../engine/data/Sprite";
import { WetnessEffect } from "../../../engine/effects/WetnessEffect";
import { Vector2 } from "../../../engine/math/Vector2";
import { heavyRainDropSprite } from "../../sprites/heavyRainDropSprite";
import { rainDropSprite } from "../../sprites/rainDropSprite";
import { WeatherParticle } from "./WeatherParticle";

export abstract class Raindrop extends WeatherParticle {
    constructor(
        sprite: Sprite,
        position: Vector2,
        state: number = 0,
        options: { decaySpeed?: number } = { decaySpeed: WeatherParticle.DefaultDecaySpeed },
    ) {
        super(sprite, position, state, options);
        this.type = "raindrop";
        this.hostEffects.push(new WetnessEffect("rain"));
        
    }

    protected onRemove(): void {
        const tile = this.parent?.scene!.tilesObject.getTileAt(this.getWorldPosition(new Vector2()));
        tile?.addSoftDisturbance();
        tile?.decreaseSnow();
        tile?.increaseMud();
    }
}

export class LightRaindrop extends Raindrop {
    constructor(position: Vector2, state: number = 0) {
        super(rainDropSprite, position, state);
    }
}

export class HeavyRaindrop extends Raindrop {
    constructor(position: Vector2, state: number = 0) {
        super(heavyRainDropSprite, position, state, { decaySpeed: WeatherParticle.DefaultDecaySpeed / 2 });
    }
}