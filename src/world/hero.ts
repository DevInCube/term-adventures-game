import { Npc } from "../engine/objects/Npc";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { LampItem, SaddleItem, GlassesItem, MudBootsItem, RingItem, SwordItem, BowItem } from "./items";
import { NpcMovementOptions, defaultMovementOptions } from "../engine/objects/NpcMovementOptions";
import { Object2D } from "../engine/objects/Object2D";
import { Vector2 } from "../engine/math/Vector2";

export const hero = new class extends Npc {
    constructor() {
        super(new ObjectSkin().char('🐱'));

        this.type = "human";
        this.health = 25;
        this.maxHealth = 25;
        this.movementOptions = <NpcMovementOptions>{
            ...defaultMovementOptions.walking,
            walkingSpeed: 5,
        };

        this.inventory.items.push(new BowItem(), new SwordItem(), new LampItem(), new MudBootsItem(), new SaddleItem(), new GlassesItem(), new RingItem());
        this.equipment.equip(this.inventory.items[0]);

        const cursorSkin = new ObjectSkin().background('transparent').option({ border: ['yellow', 'yellow', 'yellow', 'yellow'] });
        this.add(new Object2D(Vector2.zero, cursorSkin).translateX(1));
    }
};
