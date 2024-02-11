import { Item } from "../engine/objects/Item";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { MountBehavior } from "./behaviors/MountBehavior";
import { emitEvent } from "../engine/events/EventLoop";
import { GameEvent } from "../engine/events/GameEvent";
import { Npc } from "../engine/objects/Npc";
import { Vector2 } from "../engine/math/Vector2";

export class LampItem extends Item {
    public isHandheld = true;
    constructor() {
        super(
            Vector2.zero,
            new ObjectSkin().char(`🏮`),
            new ObjectPhysics().light('f').temperature('a'),
        );
        this.type = "lamp";
    }
}

export class SwordItem extends Item {
    public isHandheld = true;
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

export const victoryItem = () => Item.create("victory_item", new ObjectSkin().char(`W`));

export const bambooSeed = () => Item.create("bamboo_seed", new ObjectSkin().char(`▄`).color('#99bc20'));

export const honeyPot = () => Item.create("honey_pot", new ObjectSkin().char(`🍯`));

// TODO: reveals invisible underwater chests.
export const seaShell = () => Item.create("sea_shell", new ObjectSkin().char(`🐚`));

export class GlassesItem extends Item {
    public isWearable = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`👓`));
        this.type = "glasses";
    }
};

export class MudBootsItem extends Item {
    public isWearable = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🥾`));
        this.type = "mud_boots";
        this.visible = false;
    }

    updateItem(ticks: number, npc: Npc) {
        let index: number;
        while((index = npc.effects.findIndex(x => "isMud" in x && "isSlowness" in x)) !== -1) {
            npc.effects.splice(index, 1);
        }
    }
};

export class SaddleItem extends Item {
    public isHandheld = true;
    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🐾`));

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
