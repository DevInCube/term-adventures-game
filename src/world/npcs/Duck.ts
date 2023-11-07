import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { PreyGroupBehavior } from "../behaviors/PreyGroupBehavior";

// Likes to wander and stay in water, has good speed in water
export class Duck extends Npc {
    type = "duck";
    maxHealth = 1;
    health = 1;

    constructor() {
        super(new ObjectSkin(`🦆`, `.`, {
            '.': [undefined, 'transparent'],
        }), [0, 0]);

        this.behaviors.push(new PreyGroupBehavior());
    }

    new() {
        return new Duck();
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const duck = this;
        //
        if (duck.parameters["state"] === "feared") {
            duck.skin.raw_colors[0][0] = [undefined, "#FF000055"];
        } else if (duck.parameters["stress"] > 1) {
            duck.skin.raw_colors[0][0] = [undefined, "#FF8C0055"];
        } else if (duck.parameters["stress"] > 0) {
            duck.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
        } else {
            duck.skin.raw_colors[0][0] = [undefined, "transparent"];
        }
    }
}