import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { PreyGroupBehavior } from "../behaviors/PreyGroupBehavior";
import { NpcMovementOptions } from "../../engine/objects/NpcMovementOptions";

// Likes to wander and stay in water, has good speed in water
class Duck extends Npc {
    constructor(position: [number, number]) {
        super(new ObjectSkin(`🦆`, `.`, {
            '.': [undefined, 'transparent'],
        }), position);

        this.type = "duck";
        this.movementOptions = <NpcMovementOptions>{
            walkingSpeed: 2,
            swimmingSpeed: 5,
        };
        this.behaviors.push(new PreyGroupBehavior());
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
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
    return new Duck(options.position);
}