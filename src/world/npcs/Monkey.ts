import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { LampItem } from "../items";
import { Vector2 } from "../../engine/math/Vector2";

export class Monkey extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin().char(`🐒`), position);

        this.type = "monkey";
        this.behaviors.push(new WanderingBehavior());

        this.inventory.items.push(new LampItem());
        this.equipment.equip(this.inventory.items[0]);
    }
}
