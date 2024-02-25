import { Npc } from "../objects/Npc";
import { Object2D } from "../objects/Object2D";
import { Effect } from "./Effect";

export class ActiveEffect {
    time = 0;

    constructor(
        public readonly effect: Effect,
        public readonly activator: Object2D,
    ) {

    }

    update(ticks: number, npc: Npc) {
        this.time += ticks;
    }

    isExpired() {
        return this.time >= this.effect.ticks;
    }
}