import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { PreyGroupBehavior } from "../behaviors/PreyGroupBehavior";
import { NpcMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

// Likes to wander and stay in water, has good speed in water
class Duck extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin().char(`🦆`), position);

        this.type = "duck";
        this.movementOptions = <NpcMovementOptions>{
            walkingSpeed: 2,
            swimmingSpeed: 5,
        };
        this.behaviors.push(new PreyGroupBehavior({ friendTypes: [this.type] }));
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const duck = this;
        //
        if (duck.parameters["state"] === "feared") {
            duck.skin.background("#FF000055");
        } else if (duck.parameters["stress"] > 1) {
            duck.skin.background("#FF8C0055");
        } else if (duck.parameters["stress"] > 0) {
            duck.skin.background("#FFFF0055");
        } else {
            duck.skin.background("transparent");
        }
    }
}

export function duck(options: { position: [number, number] }) {
    return new Duck(Vector2.from(options.position));
}