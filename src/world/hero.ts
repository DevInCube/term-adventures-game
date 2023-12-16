import { Npc } from "../engine/objects/Npc";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { lamp, sword } from "./items";
import { Scene } from "../engine/Scene";
import { Item } from "../engine/objects/Item";
import { Inventory } from "../engine/objects/Inventory";

export const hero = new class extends Npc{
    type = "human";
    moveSpeed = 10;
    showCursor = true;
    objectInMainHand: Item | null;
    objectInSecondaryHand: Item | null;

    constructor() {
        super(new ObjectSkin('🐱', '.', {'.': [undefined, 'transparent']}), [9, 7]);
        const aSword = sword();
        const aLamp = lamp(); 
        this.inventory.items.push(aSword);
        this.inventory.items.push(aLamp);
        this.objectInMainHand = aSword;
        this.objectInSecondaryHand = aLamp;
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const obj = this;
        obj.moveTick += ticks;
    }
};
