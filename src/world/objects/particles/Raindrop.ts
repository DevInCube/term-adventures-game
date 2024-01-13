import { Scene } from "../../../engine/Scene";
import { Particle } from "../../../engine/objects/Particle";
import { rainDropSprite } from "../../sprites/rainDropSprite";

export class Raindrop extends Particle {
    constructor(position: [number, number], state: number = 0) {
        super(rainDropSprite, position, state, {
            decaySpeed: 300,
        });
        this.type = "raindrop";
    }

    protected onRemove(scene: Scene): void {
        const tile = scene.getTileAt(this.position);
        tile?.decreaseSnow();
    }
}
