import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { PreyGroupBehavior } from "../behaviors/PreyGroupBehavior";
import { Vector2 } from "../../engine/math/Vector2";
import { Colors } from "../../engine/math/Colors";
import { Color } from "../../engine/math/Color";

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
            sheep.skin.background(new Color(Colors.Red).setAlpha(0x55 / 0xff));
        } else if (sheep.parameters["stress"] > 1) {
            sheep.skin.background(new Color(Colors.Orange).setAlpha(0x55 / 0xff));
        } else if (sheep.parameters["stress"] > 0) {
            sheep.skin.background(new Color(Colors.Yellow).setAlpha(0x55 / 0xff));
        } else {
            sheep.skin.background(Colors.Transparent);
        }
    }
}

export function sheep(options: { position: [number, number] }) {
    return new Sheep(Vector2.from(options.position));
}