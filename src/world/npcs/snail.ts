import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { MountBehavior } from "../behaviors/MountBehavior";

export class Snail extends Npc {
    type = "snail";
    maxHealth = 3;
    health = 3;

    constructor(position: [number, number]) {
        super(new ObjectSkin(`🐌`), position);

        this.moveSpeed = 1;
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