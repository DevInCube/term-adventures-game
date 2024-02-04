import { Npc } from "../engine/objects/Npc";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { lamp, saddle, glasses, sword } from "./items";
import { NpcMovementOptions, defaultMovementOptions } from "../engine/objects/NpcMovementOptions";
import { Object2D } from "../engine/objects/Object2D";
import { Vector2 } from "../engine/math/Vector2";

export const hero = new class extends Npc {
    constructor() {
        super(new ObjectSkin().char('🐱'));

        this.type = "human";
        this.movementOptions = <NpcMovementOptions>{
            ...defaultMovementOptions.walking,
            walkingSpeed: 5,
        };

        this.inventory.items.push(lamp(), saddle(), glasses(), sword());
        this.equipment.equip(this.inventory.items[0]);

        const cursorSkin = new ObjectSkin().background('transparent').option({ border: ['yellow', 'yellow', 'yellow', 'yellow'] });
        this.add(new Object2D(Vector2.zero, cursorSkin).translateX(1));
    }
};
