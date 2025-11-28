import { Effect } from "./Effect";
import { Color } from "../math/Color";

export class LightEffect extends Effect {
    isLuminocite = true;

    constructor(
        public type: string,
        public level: number,
        public color: Color,
        ticks: number = 0
    ) {
        super("light", type, level, ticks);
        this.isStackable = true;
        this.isMaxOverridable = true;
    }
}

export function isLuminocite(x: Effect): x is LightEffect {
    return ("isLuminocite" in x);
}
