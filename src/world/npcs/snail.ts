import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { MountBehavior } from "../behaviors/MountBehavior";
import { NpcMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

export class Snail extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin().char(`🐌`), position);

        this.type = "snail";
        this.movementOptions = <NpcMovementOptions>{
            climbingSpeed: 1,
            walkingSpeed: 1,
        };
        this.behaviors.push(new MountBehavior(this));
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const snail = this;
        //
        // update skin
        if (snail.parameters["isMounted"]) {
            snail.skin.background("#FFFF0055");
        } else {
            snail.skin.background("#FF00FF55");
        }
    }
}