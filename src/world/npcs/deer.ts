import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { MountBehavior } from "../behaviors/MountBehavior";
import { NpcMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/data/Vector2";

export class Deer extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin(`🦌`), position);

        this.type = "deer";
        this.movementOptions = <NpcMovementOptions>{
            walkingSpeed: 10,
            swimmingSpeed: 1,
        };
        this.behaviors.push(new MountBehavior(this));
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const deer = this;
        //
        // update skin
        if (deer.parameters["isMounted"]) {
            deer.skin.setBackgroundAt([0, 0], "#FFFF0055");
        } else {
            deer.skin.setBackgroundAt([0, 0], "#FF00FF55");
        }
    }
}

export function deer(options: { position: [number, number] }) {
    return new Deer(Vector2.from(options.position));
}