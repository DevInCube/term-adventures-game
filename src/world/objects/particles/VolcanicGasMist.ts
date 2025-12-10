import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { Vector2 } from "../../../engine/math/Vector2";
import { Sprite } from "../../../engine/data/Sprite";
import { Particle } from "../../../engine/objects/Particle";
import { Colors } from "../../../engine/math/Colors";
import { Color } from "../../../engine/math/Color";

export class VolcanicGasMist extends Particle {
    constructor(position: Vector2) {
        const sprite = new Sprite();
        const skin = new ObjectSkin().background(new Color(Colors.DarkRed).setAlpha(0x22 / 0xff));
        sprite.frames[Particle.defaultFrameName] = [skin];
        super(sprite, position, 0, {
            decaySpeed: undefined,
        });
        this.type = "volcanic_gas_mist";
    }
}
