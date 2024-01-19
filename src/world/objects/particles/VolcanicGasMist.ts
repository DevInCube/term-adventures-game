import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { Sprite } from "../../../engine/data/Sprite";
import { Particle } from "../../../engine/objects/Particle";



export class VolcanicGasMist extends Particle {
    constructor(position: [number, number]) {
        const sprite = new Sprite();
        const skin = new ObjectSkin(' ', '.', { '.': [undefined, '#a002'] });
        sprite.frames[Particle.defaultFrameName] = [skin];
        super(sprite, position, 0, {
            decaySpeed: undefined,
        });
        this.type = "volcanic_gas_mist";
    }
}
