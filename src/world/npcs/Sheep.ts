import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { PreyGroupBehavior } from "../behaviors/PreyGroupBehavior";
import { Vector2 } from "../../engine/math/Vector2";

class Sheep extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin(`🐑`, `.`, {
            '.': [undefined, 'transparent'],
        }), position);

        this.type = "sheep";
        this.maxHealth = 1;
        this.health = 1;
        this.behaviors.push(new PreyGroupBehavior());
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const sheep = this;
        //
        // update skin
        if (sheep.parameters["state"] === "feared") {
            sheep.skin.setBackgroundAt([0, 0], '#FF000055');
        } else if (sheep.parameters["stress"] > 1) {
            sheep.skin.setBackgroundAt([0, 0], '#FF8C0055');
        } else if (sheep.parameters["stress"] > 0) {
            sheep.skin.setBackgroundAt([0, 0], '#FFFF0055');
        } else {
            sheep.skin.setBackgroundAt([0, 0], 'transparent');
        }
    }
}

export function sheep(options: { position: [number, number] }) {
    return new Sheep(Vector2.from(options.position));
}