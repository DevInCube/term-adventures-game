import { Effect } from "./Effect";

export class SlownessEffect extends Effect {
    isSlowness = true;

    constructor(
        public type: string,
        public movementPenalty: number,
        ticks: number = 0,
    ) {
        super("slowness", type, movementPenalty, ticks);
    }
}

export function isSlowness(x: Effect): x is SlownessEffect {
    return ("isSlowness" in x);
}

export class MudSlownessEffect extends SlownessEffect {
    isMud = true;

    constructor(movementPenalty: number) {
        super("mud", movementPenalty, 1000);
        this.isStackable = false;
        this.isMaxOverridable = true;
    }
}

export class SnowSlownessEffect extends SlownessEffect {
    isSnow = true;

    constructor(movementPenalty: number) {
        super("snow", movementPenalty, 2000);
        this.isStackable = false;
        this.isMaxOverridable = true;
    }
}

export class SlownessReductionEffect extends Effect {
    isSlownessReduction = true;
    
    constructor(
        public slownessType: string,
        public reduction: number,  // 0..1
    ) {
        super("slowness_reduction", slownessType, reduction);
    }
}

export function isSlownessReduction(x: Effect): x is SlownessReductionEffect {
    return ("isSlownessReduction" in x);
}