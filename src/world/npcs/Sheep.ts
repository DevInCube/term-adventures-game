import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { PreyGroupBehavior } from "../behaviors/PreyGroupBehavior";

export class Sheep extends Npc {
    type = "sheep";
    maxHealth = 1;
    health = 1;

    constructor() {
        super(new ObjectSkin(`🐑`, `.`, {
            '.': [undefined, 'transparent'],
        }), [0, 0]);

        this.behaviors.push(new PreyGroupBehavior());
    }

    new() {
        return new Sheep();
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const sheep = this;
        //
        // update skin
        if (sheep.parameters["state"] === "feared") {
            sheep.skin.raw_colors[0][0] = [undefined, "#FF000055"];
        } else if (sheep.parameters["stress"] > 1) {
            sheep.skin.raw_colors[0][0] = [undefined, "#FF8C0055"];
        } else if (sheep.parameters["stress"] > 0) {
            sheep.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
        } else {
            sheep.skin.raw_colors[0][0] = [undefined, "transparent"];
        }
    }
}