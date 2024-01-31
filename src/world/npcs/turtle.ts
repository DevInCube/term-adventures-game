import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { MountBehavior } from "../behaviors/MountBehavior";
import { defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

export class Turtle extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin().char(`🐢`), position);

        this.type = "turtle";
        this.movementOptions = defaultMovementOptions.amphibious;
        this.behaviors.push(new MountBehavior(this));
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const turtle = this;
        //
        // update skin
        if (turtle.parameters["isMounted"]) {
            turtle.skin.background("#FFFF0055");
        } else {
            turtle.skin.background("#FF00FF55");
        }
    }
}
