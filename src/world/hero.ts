import { Npc } from "../engine/objects/Npc";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { LampItem, SaddleItem, GlassesItem, MudBootsItem, RingItem, SwordItem, BowItem, CloakItem, FireWandItem, PoisonDaggerItem, HammerItem, LightRingItem, ThunderStaffItem } from "./items";
import { NpcMovementOptions, defaultMovementOptions } from "../engine/objects/NpcMovementOptions";
import { Object2D } from "../engine/objects/Object2D";
import { Vector2 } from "../engine/math/Vector2";

export const hero = new class extends Npc {
    constructor() {
        super(new ObjectSkin().char('🐱'));

        this.name = "hero";
        this.type = "human";
        const health = 99;
        this.health = health;
        this.maxHealth = health;
        //this.stunValue = 10; // TEST: stunned hero.
        this.movementOptions = <NpcMovementOptions>{
            ...defaultMovementOptions.walking,
            walkingSpeed: 5,
        };

        this.inventory.items.push(...[
            new SwordItem(),
            new PoisonDaggerItem(),
            new HammerItem(),
            new BowItem(),
            new FireWandItem(),
            new ThunderStaffItem(),
            new LampItem(),
            new MudBootsItem(),
            new SaddleItem(),
            new GlassesItem(),
            new RingItem(),
            new LightRingItem(),
            new CloakItem(),
        ]);
        this.equipment.equip(this.inventory.items[0]);

        const cursorSkin = new ObjectSkin().background('transparent').option({ border: ['yellow', 'yellow', 'yellow', 'yellow'] });
        this.add(new Object2D(Vector2.zero, cursorSkin).translateX(1));
    }
};
