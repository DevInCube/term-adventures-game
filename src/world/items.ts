import { Item } from "../engine/objects/Item";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { MountBehavior } from "./behaviors/MountBehavior";
import { emitEvent } from "../engine/events/EventLoop";
import { GameEvent } from "../engine/events/GameEvent";
import { Npc } from "../engine/objects/Npc";
import { Vector2 } from "../engine/math/Vector2";

export const lamp = () => {
    const item = Item.create(
        "lamp",
        new ObjectSkin().char(`🏮`),
        new ObjectPhysics().light('f').temperature('a'),
    );
    return item;
}

export class SwordItem extends Item {
    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🗡`));
        
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

export const victoryItem = () => Item.create("victory_item", new ObjectSkin().char(`W`));

export const bambooSeed = () => Item.create("bamboo_seed", new ObjectSkin().char(`▄`).color('#99bc20'));

export const honeyPot = () => Item.create("honey_pot", new ObjectSkin().char(`🍯`));

// TODO: reveals invisible underwater chests.
export const seaShell = () => Item.create("sea_shell", new ObjectSkin().char(`🐚`));

export const glasses = () => Item.create("glasses", new ObjectSkin().char(`👓`));

export class Saddle extends Item {
    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🐾`).color('#99bc20'));

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
