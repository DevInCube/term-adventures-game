import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { MountBehavior } from "../behaviors/MountBehavior";
import { NpcMovementOptions } from "../../engine/objects/NpcMovementOptions";

export class Snail extends Npc {
    constructor(position: [number, number]) {
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
            snail.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
        } else {
            snail.skin.raw_colors[0][0] = [undefined, "#FF00FF55"];
        }
    }
}