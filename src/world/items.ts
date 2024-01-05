import { Item } from "../engine/objects/Item";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { MountBehavior } from "./behaviors/MountBehavior";
import { emitEvent } from "../engine/events/EventLoop";
import { GameEvent } from "../engine/events/GameEvent";
import { Npc } from "../engine/objects/Npc";

export const lamp = () => {
    const physics = new ObjectPhysics(` `, `x`, `a`);
    physics.lightsMap = { 'x': { intensity: 'f', color: [255, 255, 255] }}; 
    const item = Item.create(
        "lamp",
        new ObjectSkin(`🏮`),
        physics,
    );
    return item;
}

export class SwordItem extends Item {
    constructor() {
        super([0, 0],
            new ObjectSkin(`🗡`));
        
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

export const emptyHand = () => Item.create("empty_hand", new ObjectSkin(` `));

export const victoryItem = () => Item.create("victory_item", new ObjectSkin(`W`));

export const bambooSeed = () => Item.create(
    "bamboo_seed",
    new ObjectSkin(`▄`, `T`, {'T': ['#99bc20', 'transparent']})
);

export const honeyPot = () => Item.create(
    "honey_pot",
    new ObjectSkin(`🍯`)
);

// TODO: reveals invisible underwater chests.
export const seaShell = () => Item.create("sea_shell", new ObjectSkin(`🐚`));

export class Saddle extends Item {
    constructor() {
        super([0, 0],
            new ObjectSkin(`🐾`, `T`, {'T': ['#99bc20', 'transparent']}));

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
