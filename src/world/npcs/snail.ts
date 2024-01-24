import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { MountBehavior } from "../behaviors/MountBehavior";
import { NpcMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/data/Vector2";

export class Snail extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin(`🐌`), position);

        this.type = "snail";
        this.movementOptions = <NpcMovementOptions>{
            climbingSpeed: 1,
            walkingSpeed: 1,
        };
        this.behaviors.push(new MountBehavior(this));
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const snail = this;
        //
        // update skin
        if (snail.parameters["isMounted"]) {
            snail.skin.setBackgroundAt([0, 0], "#FFFF0055");
        } else {
            snail.skin.setBackgroundAt([0, 0], "#FF00FF55");
        }
    }
}