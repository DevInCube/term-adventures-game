import { Effect } from "./Effect";

export class CloakEffect extends Effect {
    isCloak = true;

    constructor(
        public type: string,
        public level: number,
        ticks: number = 0
    ) {
        super("cloak", type, level, ticks);
        this.isStackable = true;
        this.isMaxOverridable = true;
    }
}

export function isCloak(x: Effect): x is CloakEffect {
    return ("isCloak" in x);
}

export class LightCloakEffect extends CloakEffect {
    isLight = true;

    constructor(
        public level: number,
        ticks: number = 0
    ) {
        super("light", level, ticks);
    }
}

export function isLight(x: Effect): x is LightCloakEffect {
    return ("isLight" in x);
}
