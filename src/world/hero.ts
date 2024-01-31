import { Npc } from "../engine/objects/Npc";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { lamp, saddle, glasses, sword } from "./items";
import { NpcMovementOptions, defaultMovementOptions } from "../engine/objects/NpcMovementOptions";

export const hero = new class extends Npc {
    constructor() {
        super(new ObjectSkin().char('🐱'));

        this.type = "human";
        this.showCursor = true;
        this.movementOptions = <NpcMovementOptions>{
            ...defaultMovementOptions.walking,
            walkingSpeed: 5,
        };

        const aSword = sword();
        const aLamp = lamp(); 
        this.inventory.items.push(aLamp);
        this.inventory.items.push(saddle());
        this.inventory.items.push(glasses());
        this.inventory.items.push(aSword);
        this.equipment.equip(aLamp);
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const obj = this;
        obj.moveTick += ticks;
    }
};
