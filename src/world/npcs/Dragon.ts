import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { MountBehavior } from "../behaviors/MountBehavior";

export class Dragon extends Npc {
    type = "dragon";
    maxHealth = 5;
    health = 5;

    constructor(position: [number, number]) {
        super(new ObjectSkin(`🐉`), position);

        this.moveSpeed = 3;
        this.behaviors.push(new MountBehavior(this));
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const dragon = this;
        //
        // update skin
        if (dragon.parameters["isMounted"]) {
            dragon.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
        } else {
            dragon.skin.raw_colors[0][0] = [undefined, "#FF00FF55"];
        }
    }
}
