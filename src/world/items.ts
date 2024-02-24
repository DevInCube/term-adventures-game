import { Item } from "../engine/objects/Item";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { MountBehavior } from "./behaviors/MountBehavior";
import { emitEvent } from "../engine/events/EventLoop";
import { GameEvent } from "../engine/events/GameEvent";
import { Npc } from "../engine/objects/Npc";
import { Vector2 } from "../engine/math/Vector2";
import { DamageReductionEffect } from "../engine/effects/DamageEffect";
import { SlownessReductionEffect } from "../engine/effects/SlownessEffect";

export class LampItem extends Item {
    isHandheld = true;

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
    isHandheld = true;

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
    isWearable = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`👓`));
        this.type = "glasses";
    }
};

export class MudBootsItem extends Item {
    isWearable = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🥾`));
        this.type = "mud_boots";
        this.visible = false;
        this.effects.push(new SlownessReductionEffect("mud", 1));
    }
};

export class SaddleItem extends Item {
    isHandheld = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🐾`));

        this.type = "saddle";
        this.setUsage(ctx => {
            if (ctx.initiator.mount) {
                const mountBeh = ctx.initiator.mount.behaviors
                    .find(x => x instanceof MountBehavior) as MountBehavior;
                if (mountBeh) {
                    mountBeh.unmount();
                }
            } else if (ctx.subject instanceof Npc) {
                const mountBeh = ctx.subject.behaviors
                    .find(x => x instanceof MountBehavior) as MountBehavior;
                if (mountBeh) {
                    mountBeh.mount(ctx.initiator);
                }
            }
        });
    }
}

export class RingItem extends Item {
    isRing = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char('💍'));
        this.type = "ring";
        this.visible = false;

        this.effects.push(new DamageReductionEffect("poison", 0.5));
        this.effects.push(new DamageReductionEffect("fire", 1));
    }
}