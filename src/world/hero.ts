import { Npc } from "../engine/objects/Npc";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { lamp, saddle, glasses, sword } from "./items";
import { NpcMovementOptions, defaultMovementOptions } from "../engine/objects/NpcMovementOptions";
import { Object2D } from "../engine/objects/Object2D";
import { Vector2 } from "../engine/math/Vector2";
import { Grid } from "../engine/math/Grid";
import { Cell } from "../engine/graphics/Cell";

export const hero = new class extends Npc {
    constructor() {
        super(new ObjectSkin().char('🐱'));

        this.type = "human";
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

        const cursorCell = new Cell(' ');
        cursorCell.options = { border: ['yellow', 'yellow', 'yellow', 'yellow'] };
        const skin = new ObjectSkin(Grid.from([[cursorCell]])).background('transparent');
        this.add(new Object2D(Vector2.zero, skin).translateX(1));
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const obj = this;
        obj.moveTick += ticks;
    }
};
