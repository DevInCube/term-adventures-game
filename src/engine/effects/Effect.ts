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

    activate(): ActiveEffect {
        return new ActiveEffect(this);
    }
}
