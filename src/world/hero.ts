import { Npc } from "../engine/objects/Npc";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { emptyHand, lamp, saddle, sword } from "./items";
import { Scene } from "../engine/Scene";

export const hero = new class extends Npc {
    type = "human";
    moveSpeed = 5;
    showCursor = true;

    constructor() {
        super(new ObjectSkin('🐱'), [9, 7]);
        const anEmptyHand = emptyHand();
        const aSword = sword();
        const aLamp = lamp(); 
        this.inventory.items.push(anEmptyHand);
        this.inventory.items.push(aSword);
        this.inventory.items.push(aLamp);
        this.inventory.items.push(saddle());
        this.equipment.equip(aLamp);
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const obj = this;
        obj.moveTick += ticks;
    }
};
