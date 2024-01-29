import { Item } from "../engine/objects/Item";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../engine/components/ObjectSkinBuilder";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { MountBehavior } from "./behaviors/MountBehavior";
import { emitEvent } from "../engine/events/EventLoop";
import { GameEvent } from "../engine/events/GameEvent";
import { Npc } from "../engine/objects/Npc";
import { Vector2 } from "../engine/math/Vector2";
import { Color } from "../engine/math/Color";

export const lamp = () => {
    const physics = new ObjectPhysics(` `, `x`, `a`);
    physics.lightsMap = { 'x': { intensity: 'f', color: new Color(1, 1, 1) }}; 
    const item = Item.create(
        "lamp",
        new ObjectSkinBuilder(`🏮`).build(),
        physics,
    );
    return item;
}

export class SwordItem extends Item {
    constructor() {
        super(Vector2.zero,
            new ObjectSkinBuilder(`🗡`).build());
        
        this.type = "sword";
        this.setUsage(ctx => {
            if (ctx.subject) {
                emitEvent(new GameEvent(ctx.initiator, 'attack', {
                    object: ctx.initiator,
                    subject: ctx.subject,
                }));
            }
        });
    }
}

export const sword = () => new SwordItem();

export const victoryItem = () => Item.create("victory_item", new ObjectSkinBuilder(`W`).build());

export const bambooSeed = () => Item.create(
    "bamboo_seed",
    new ObjectSkinBuilder(`▄`, `T`, {'T': ['#99bc20', 'transparent']}).build()
);

export const honeyPot = () => Item.create(
    "honey_pot",
    new ObjectSkinBuilder(`🍯`).build()
);

// TODO: reveals invisible underwater chests.
export const seaShell = () => Item.create("sea_shell", new ObjectSkinBuilder(`🐚`).build());

export const glasses = () => Item.create("glasses", new ObjectSkinBuilder(`👓`).build());

export class Saddle extends Item {
    constructor() {
        super(Vector2.zero,
            new ObjectSkinBuilder(`🐾`, `T`, {'T': ['#99bc20', 'transparent']}).build());

        this.type = "saddle";
        this.setUsage(ctx => {
            if (ctx.initiator.mount) {
                const mountBeh = ctx.initiator.mount.behaviors.find(x => x instanceof MountBehavior) as MountBehavior;
                if (mountBeh) {
                    mountBeh.unmount();
                }
            } else if (ctx.subject instanceof Npc) {
                const mountBeh = ctx.subject.behaviors.find(x => x instanceof MountBehavior) as MountBehavior;
                if (mountBeh) {
                    mountBeh.mount(ctx.initiator);
                }
            }
        });
    }
}

export const saddle = () => new Saddle();
