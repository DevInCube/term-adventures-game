import { Effect } from "./Effect";

export class WetnessEffect extends Effect {
    isWetness = true;

    constructor(
        public readonly type: string,
        ticks: number = 0,
    ) {
        super("wetness", type, ticks);
    }
}

export function isWetness(x: Effect): x is WetnessEffect {
    return ("isWetness" in x);
}

export class WaterWetnessEffect extends WetnessEffect {
    isWater = true;

    constructor() {
        super("water", 1000);
        this.isStackable = false;
        this.isMaxOverridable = true;
    }
}
