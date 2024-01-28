import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { lamp } from "../items";
import { Vector2 } from "../../engine/math/Vector2";

export class Monkey extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkinBuilder(`🐒`).build(), position);

        this.type = "monkey";
        this.behaviors.push(new WanderingBehavior());

        const aLamp = lamp();
        this.inventory.items.push(aLamp);
        this.equipment.equip(aLamp);
    }
}
