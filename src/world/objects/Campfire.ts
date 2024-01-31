import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { Sprite } from "../../engine/data/Sprite";
import { Object2D } from "../../engine/objects/Object2D";
import { Smoke } from "./particles/Smoke";

export class Campfire extends Object2D {
    private smokeTicks: number = 0;
    private _sprite: Sprite;
    private firePhysics: ObjectPhysics;
    private smokePhysics: ObjectPhysics;

    constructor(position: Vector2) {
        const sprite = Sprite.parseSimple('🔥💨');
        sprite.frames["0"][0].setForegroundAt([0, 0], 'red');
        const firePhysics = new ObjectPhysics().light("F").temperature("F");
        const smokePhysics = new ObjectPhysics().light("6").temperature("8");
        super(Vector2.zero, sprite.frames["0"][0], firePhysics, position);
        
        this._sprite = sprite;
        this.firePhysics = firePhysics;
        this.smokePhysics = smokePhysics;
        this.type = "campfire";
    }

    update(ticks: number) {
        super.update(ticks);

        const positionWeather = this.scene!.weather.getWeatherInfoAt(this.position).weatherType;
        const isRainyWeather = 
            positionWeather === 'rain' ||
            positionWeather === 'rain_and_snow';
        if (isRainyWeather) {
            this.skin = this._sprite.frames["1"][0];
            this.physics = this.smokePhysics;
        } else {
            this.skin = this._sprite.frames["0"][0];
            this.physics = this.firePhysics;

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