import { Object2D } from "../objects/Object2D";
import { ActiveEffect } from "./ActiveEffect";

export class Effect {
    isStackable = false;
    isMaxOverridable = false;

    constructor(
        public readonly name: string,
        public readonly type: string,
        public readonly value: number,
        public readonly ticks: number = 0
    ) {
    }

    activate(activator: Object2D): ActiveEffect {
        return new ActiveEffect(this, activator);
    }
}
