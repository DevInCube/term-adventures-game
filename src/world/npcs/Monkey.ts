import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { lamp } from "../items";

export class Monkey extends Npc {
    constructor(position: [number, number]) {
        super(new ObjectSkin(`🐒`), position);

        this.type = "monkey";
        this.behaviors.push(new WanderingBehavior());

        const aLamp = lamp();
        this.inventory.items.push(aLamp);
        this.equipment.equip(aLamp);
    }
}
