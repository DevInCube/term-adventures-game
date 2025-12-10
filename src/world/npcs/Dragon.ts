import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { MountBehavior } from "../behaviors/MountBehavior";
import { defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";
import { Colors } from "../../engine/math/Colors";
import { Color } from "../../engine/math/Color";

export class Dragon extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin().char(`🐉`), position);

        this.type = "dragon";
        this.movementOptions = defaultMovementOptions.flying;
        this.behaviors.push(new MountBehavior(this));
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const dragon = this;
        //
        // update skin
        if (dragon.parameters["isMounted"]) {
            dragon.skin.background(new Color(Colors.Yellow).setAlpha(0x55 / 0xff));
        } else {
            dragon.skin.background(new Color(Colors.Purple).setAlpha(0x55 / 0xff));
        }
    }
}
