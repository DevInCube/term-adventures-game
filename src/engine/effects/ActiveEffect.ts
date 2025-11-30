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

    start(npc: Npc) {
        this.onStarted(npc);
    }

    update(ticks: number, _npc: Npc) {
        this.time += ticks;
    }

    isExpired() {
        return this.time >= this.effect.ticks;
    }

    protected onStarted(_npc: Npc) {
    }
}