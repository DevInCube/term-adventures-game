import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { Sprite } from "../../../engine/data/Sprite";
import { Particle } from "../../../engine/objects/Particle";

export class Mist extends Particle {
    constructor(position: [number, number]) {
        const sprite = new Sprite();
        const skin = new ObjectSkin(' ', '.', { '.': [undefined, '#fff'] });
        sprite.frames[Particle.defaultFrameName] = [skin];
        super(sprite, position, 0);
        this.type = "mist";
    }
}
