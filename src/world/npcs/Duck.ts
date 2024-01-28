import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { PreyGroupBehavior } from "../behaviors/PreyGroupBehavior";
import { NpcMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

// Likes to wander and stay in water, has good speed in water
class Duck extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkinBuilder(`🦆`, `.`, {
            '.': [undefined, 'transparent'],
        }).build(), position);

        this.type = "duck";
        this.movementOptions = <NpcMovementOptions>{
            walkingSpeed: 2,
            swimmingSpeed: 5,
        };
        this.behaviors.push(new PreyGroupBehavior());
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const duck = this;
        //
        if (duck.parameters["state"] === "feared") {
            duck.skin.setBackgroundAt([0, 0], "#FF000055");
        } else if (duck.parameters["stress"] > 1) {
            duck.skin.setBackgroundAt([0, 0], "#FF8C0055");
        } else if (duck.parameters["stress"] > 0) {
            duck.skin.setBackgroundAt([0, 0], "#FFFF0055");
        } else {
            duck.skin.setBackgroundAt([0, 0], "transparent");
        }
    }
}

export function duck(options: { position: [number, number] }) {
    return new Duck(Vector2.from(options.position));
}