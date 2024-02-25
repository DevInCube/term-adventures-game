import { Npc } from "../objects/Npc";
import { Object2D } from "../objects/Object2D";
import { ActiveEffect } from "./ActiveEffect";
import { Effect } from "./Effect";

export class DamageEffect extends Effect {
    isDamage = true;

    constructor(
        public type: string,
        public damageValue: number,
        public damageInterval: number,
        damageTicksDuration: number = 1,
    ) {
        super("damage", type, damageValue, damageTicksDuration * damageInterval);
        this.isStackable = true;
    }

    activate(activator: Object2D): ActiveEffect {
        return new DamageActiveEffect(this, activator);
    }
}

export class DamageActiveEffect extends ActiveEffect {
    damageTicks = 0;

    constructor(
        public damageEffect: DamageEffect,
        public activator: Object2D,
    ) {
        super(damageEffect, activator);
    }
    
    update(ticks: number, npc: Npc) {
        super.update(ticks, npc);

        this.damageTicks = Object2D.updateValue(this.damageTicks, ticks, this.damageEffect.damageInterval, () => {
            npc.damage(this.damageEffect.damageValue, this.damageEffect.type, this.activator);
        });
    }
}

export class PoisonDamageEffect extends DamageEffect {
    isPoison = true;

    constructor() {
        super("poison", 2, 1000, 5);
        this.isStackable = false;
    }
}

export class DamageReductionEffect extends Effect {
    isDamageReduction = true;
    
    constructor(
        public damageType: string,
        public reduction: number,  // 0..1
    ) {
        super("damage_reduction", damageType, reduction);
    }
}

export function isDamageReduction(x: Effect): x is DamageReductionEffect {
    return ("isDamageReduction" in x);
}


export class FireDamageEffect extends DamageEffect {
    isFire = true;

    constructor() {
        super("fire", 1, 1000, 3);
        this.isStackable = false;
    }
}