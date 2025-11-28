import { Item } from "../engine/objects/Item";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { MountBehavior } from "./behaviors/MountBehavior";
import { Npc } from "../engine/objects/Npc";
import { Vector2 } from "../engine/math/Vector2";
import { DamageReductionEffect } from "../engine/effects/DamageEffect";
import { SlownessReductionEffect } from "../engine/effects/SlownessEffect";
import { LightCloakEffect } from "../engine/effects/CloakEffect";
import { EquipmentTags } from "../engine/objects/EquipmentTags";
import { FireBall } from "./objects/particles/FireBall";
import { DelayedParticle } from "./objects/particles/DelayedParticle";

export class LampItem extends Item {
    [EquipmentTags.isHandheld]: true = true;

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
    [EquipmentTags.isHandheld]: true = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🗡`));
        this.type = "sword";
        this.setUsage(ctx => {
            if (ctx.subject) {
                ctx.initiator.attack(ctx.subject);
            }
        });
    }
}

export interface RangedItem {
    range: number;
}

export function isRangedItem(x: object): x is RangedItem {
    return (
        EquipmentTags.isRanged in x &&
        "range" in x
    );
}

export class BowItem extends Item {
    [EquipmentTags.isHandheld]: true = true;
    [EquipmentTags.isRanged]: true = true;
    range = 8;
    isTarget = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🏹`));
        this.type = "bow";
        this.setUsage(ctx => {
            if (ctx.subject) {
                ctx.initiator.attack(ctx.subject);
                // TODO: create arrow object (`➵`) on the scene
            }
        });
    }
}

export class FireWandItem extends Item {
    [EquipmentTags.isHandheld]: true = true;
    [EquipmentTags.isRanged]: true = true;
    range = 3;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🪄`));
        this.type = "fire_wand";
        this.setUsage(ctx => {
            if (!ctx.initiator.scene) {
                return;
            }

            const activatorPos = ctx.initiator.getWorldPosition(new Vector2());
            const scene = ctx.initiator.scene;
            const particlesObject = scene.particlesObject;

            for (let y = -this.range; y <= this.range; y++) {
                for (let x = -this.range; x <= this.range; x++) {
                    const d = new Vector2(x, y);
                    const distance = d.length;
                    if (distance > this.range || distance === 0) {
                        continue;
                    }
                    
                    const fireBallPos = activatorPos.clone().add(d);
                    if (ctx.initiator.scene.isPositionBlocked(fireBallPos)) {
                        continue;
                    }

                    fireBallPos.x = Math.round(fireBallPos.x);
                    fireBallPos.y = Math.round(fireBallPos.y);
                    
                    const delayTicks = Math.round(distance * 250);
                    const fireBall = new FireBall(fireBallPos, 0);
                    const delayedParticle = new DelayedParticle(delayTicks, fireBall);
                    particlesObject.add(delayedParticle);
                }
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
    [EquipmentTags.isWearable]: true = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`👓`));
        this.type = "glasses";
    }
};

export class MudBootsItem extends Item {
    [EquipmentTags.isWearable]: true = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char(`🥾`));
        this.type = "mud_boots";
        this.visible = false;
        this.effects.push(new SlownessReductionEffect("mud", 1));
    }
};

export class SaddleItem extends Item {
    [EquipmentTags.isHandheld]: true = true;

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
    [EquipmentTags.isRing]: true = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char('💍'));
        this.type = "ring";
        this.visible = false;

        this.effects.push(new DamageReductionEffect("poison", 0.5));
        this.effects.push(new DamageReductionEffect("fire", 1));
    }
}

export class CloakItem extends Item {
    [EquipmentTags.isWearable]: true = true;

    constructor() {
        super(Vector2.zero, new ObjectSkin().char('🧥'));
        this.type = "cloak";
        this.visible = false;

        this.effects.push(new LightCloakEffect(8));
    }
}