import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { MountBehavior } from "../behaviors/MountBehavior";
import { defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

export class Turtle extends Npc {
    constructor(position: Vector2) {
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
            turtle.skin.setBackgroundAt([0, 0], "#FFFF0055");
        } else {
            turtle.skin.setBackgroundAt([0, 0], "#FF00FF55");
        }
    }
}
