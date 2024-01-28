import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../../engine/components/ObjectSkinBuilder";
import { Vector2 } from "../../../engine/math/Vector2";
import { Sprite } from "../../../engine/data/Sprite";
import { Particle } from "../../../engine/objects/Particle";

export class VolcanicGasMist extends Particle {
    constructor(position: Vector2) {
        const sprite = new Sprite();
        const skin = new ObjectSkinBuilder(' ', '.', { '.': [undefined, '#a002'] }).build();
        sprite.frames[Particle.defaultFrameName] = [skin];
        super(sprite, position, 0, {
            decaySpeed: undefined,
        });
        this.type = "volcanic_gas_mist";
    }
}
