import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { Vector2 } from "../../engine/math/Vector2";
import { Object2D } from "../../engine/objects/Object2D";
import { DarkSmoke } from "./particles/DarkSmoke";

export class VolcanicMouth extends Object2D {
    private smokeTicks: number = 0;

    constructor(position: Vector2) {
        super(Vector2.zero, new ObjectSkinBuilder(` `, `V`, {
            V: [undefined, 'darkred'],
        }).build(), new ObjectPhysics().light('8').temperature('F'),
        position);
        
        this.type = "volcanic_mouth";
    }

    update(ticks: number) {
        super.update(ticks);

        this.smokeTicks += ticks;
        const smokeTicksOverflow = this.smokeTicks - 2000;
        if (smokeTicksOverflow >= 0) {
            const _ = this.scene!.particlesObject.tryAddParticle(new DarkSmoke(this.position));
            this.smokeTicks = smokeTicksOverflow;
        }
    }
}

export function volcanicMouth(options: { position: [number, number] }) {
    return new VolcanicMouth(Vector2.from(options.position));
}