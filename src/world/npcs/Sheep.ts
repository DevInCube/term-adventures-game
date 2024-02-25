import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { PreyGroupBehavior } from "../behaviors/PreyGroupBehavior";
import { Vector2 } from "../../engine/math/Vector2";

class Sheep extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin().char(`🐑`), position);

        this.type = "sheep";
        this.maxHealth = 1;
        this.health = 1;
        this.behaviors.push(new PreyGroupBehavior({ friendTypes: [this.type] }));
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const sheep = this;
        //
        // update skin
        if (sheep.parameters["state"] === "feared") {
            sheep.skin.background('#FF000055');
        } else if (sheep.parameters["stress"] > 1) {
            sheep.skin.background('#FF8C0055');
        } else if (sheep.parameters["stress"] > 0) {
            sheep.skin.background('#FFFF0055');
        } else {
            sheep.skin.background('transparent');
        }
    }
}

export function sheep(options: { position: [number, number] }) {
    return new Sheep(Vector2.from(options.position));
}