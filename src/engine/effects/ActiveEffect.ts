import { Npc } from "../objects/Npc";
import { Effect } from "./Effect";

export class ActiveEffect {
    time = 0;

    constructor(
        public readonly effect: Effect,
    ) {

    }

    update(ticks: number, npc: Npc) {
        this.time += ticks;
    }

    isExpired() {
        return this.time >= this.effect.ticks;
    }
}