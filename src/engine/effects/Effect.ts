import { Npc } from "../objects/Npc";

export class Effect {
    constructor(
        public name: string,
        public type: string,
        public value: number,
        public ticks: number = 0,
    ) {
    }

    update(ticks: number, npc: Npc) {
        this.ticks -= ticks;
    }
}

export class SlownessEffect extends Effect {
    public isSlowness: boolean = true;

    constructor(
        public type: string,
        private movementPenalty: number,  // 0..1
    ) {
        super("slowness", type, 0);
    }

    update(ticks: number, npc: Npc) {
        super.update(ticks, npc);

        npc.movementPenalty *= this.movementPenalty;
    }
}

export class MudSlownessEffect extends SlownessEffect {
    public isMud: boolean = true;

    constructor(movementPenalty: number) {
        super("mud", movementPenalty);
    }
}

export class SnowSlownessEffect extends SlownessEffect {
    public isSnow: boolean = true;

    constructor(movementPenalty: number) {
        super("snow", movementPenalty);
    }
}