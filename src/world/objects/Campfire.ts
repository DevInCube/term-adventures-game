import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { Sprite } from "../../engine/data/Sprite";
import { Object2D } from "../../engine/objects/Object2D";
import { Smoke } from "./particles/Smoke";

export class Campfire extends Object2D {
    private smokeTicks: number = 0;
    private _sprite: Sprite;

    constructor(position: Vector2) {
        const sprite = Sprite.parseSimple('🔥💨');
        sprite.frames["0"][0].setForegroundAt([0, 0], 'red');
        super(Vector2.zero, sprite.frames["0"][0], new ObjectPhysics(` `, 'F', 'F'),
        position);
        
        this._sprite = sprite;
        this.type = "campfire";
    }

    update(ticks: number) {
        super.update(ticks);

        const isRainyWeather = 
            this.scene!.weatherType === 'rain' ||
            this.scene!.weatherType === 'rain_and_snow';
        const isUnderTheSky = this.scene!.isRoofHoleAt(this.position);
        if (isRainyWeather && isUnderTheSky) {
            this.skin = this._sprite.frames["1"][0];
            this.physics.lights[0] = `6`;
            this.physics.temperatures[0] = `8`;
        } else {
            this.skin = this._sprite.frames["0"][0];
            this.physics.lights[0] = `F`;
            this.physics.temperatures[0] = `F`;

            this.smokeTicks += ticks;
            const smokeTicksOverflow = this.smokeTicks - 2000;
            if (smokeTicksOverflow >= 0) {
                const _ = this.scene!.particlesObject.tryAddParticle(new Smoke(this.position));
                this.smokeTicks = smokeTicksOverflow;
            }
        }
    }
}

export function campfire(options: { position: [number, number] }) {
    return new Campfire(Vector2.from(options.position));
}