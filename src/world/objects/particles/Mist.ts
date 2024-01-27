import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { Vector2 } from "../../../engine/math/Vector2";
import { Sprite } from "../../../engine/data/Sprite";
import { Particle } from "../../../engine/objects/Particle";

export class Mist extends Particle {
    constructor(position: Vector2) {
        const sprite = new Sprite();
        const skin = new ObjectSkin(' ', '.', { '.': [undefined, '#fff'] });
        sprite.frames[Particle.defaultFrameName] = [skin];
        super(sprite, position, 0, {
            decaySpeed: undefined,
        });
        this.type = "mist";
    }
}
