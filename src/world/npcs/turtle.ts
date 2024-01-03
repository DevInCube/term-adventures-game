import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { MountBehavior } from "../behaviors/MountBehavior";
import { defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";

export class Turtle extends Npc {
    constructor(position: [number, number]) {
        super(new ObjectSkin(`🐢`), position);

        this.type = "turtle";
        this.movementOptions = defaultMovementOptions.amphibious;
        this.behaviors.push(new MountBehavior(this));
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const turtle = this;
        //
        // update skin
        if (turtle.parameters["isMounted"]) {
            turtle.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
        } else {
            turtle.skin.raw_colors[0][0] = [undefined, "#FF00FF55"];
        }
    }
}
