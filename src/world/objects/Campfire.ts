import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { Sprite } from "../../engine/data/Sprite";
import { Object2D } from "../../engine/objects/Object2D";
import { Smoke } from "./particles/Smoke";

const _position = new Vector2();

export class Campfire extends Object2D {
    private smokeTicks: number = 0;
    private _sprite: Sprite;
    private firePhysics: ObjectPhysics;
    private smokePhysics: ObjectPhysics;

    constructor(position: Vector2) {
        const sprite = Sprite.parseSimple('🔥💨');
        sprite.frames["0"][0].color('red');
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

        const position = this.getWorldPosition(_position);
        const weatherInfo = this.scene!.weather.getWeatherInfoAt(position);
        const positionWeather = weatherInfo.weatherType;
        const isRainyWeather = positionWeather in ["rain", "rain_and_snow"];
        if (isRainyWeather) {
            this.skin = this._sprite.frames["1"][0];
            this.physics = this.smokePhysics;
        } else {
            this.skin = this._sprite.frames["0"][0];
            this.physics = this.firePhysics;

            this.smokeTicks = Object2D.updateValue(this.smokeTicks, ticks, 2000, () => {
                const smoke = new Smoke(this.position);
                const _ = this.scene!.particlesObject.tryAddParticle(smoke);
            });
        }
    }
}
