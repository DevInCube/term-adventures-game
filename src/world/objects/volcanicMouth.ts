import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Vector2 } from "../../engine/data/Vector2";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Scene } from "../../engine/Scene";
import { DarkSmoke } from "./particles/DarkSmoke";

export class VolcanicMouth extends StaticGameObject {
    private smokeTicks: number = 0;

    constructor(position: Vector2) {
        super(Vector2.zero, new ObjectSkin(` `, `V`, {
            V: [undefined, 'darkred'],
        }), new ObjectPhysics(` `, '8', 'F'),
        position);
        
        this.type = "volcanic_mouth";
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);

        this.smokeTicks += ticks;
        const smokeTicksOverflow = this.smokeTicks - 2000;
        if (smokeTicksOverflow >= 0) {
            const _ = this.scene!.tryAddParticle(new DarkSmoke(this.position));
            this.smokeTicks = smokeTicksOverflow;
        }
    }
}

export function volcanicMouth(options: { position: [number, number] }) {
    return new VolcanicMouth(Vector2.from(options.position));
}