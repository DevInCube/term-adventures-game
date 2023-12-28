import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { GameEvent } from "../../engine/events/GameEvent";

export class WanderingBehavior implements Behavior {

    constructor(public options: {} = {}) {
    }

    update(ticks: number, object: Npc): void {
        
        object.faceRandomDirection();
        object.moveRandomly();
    }

    handleEvent(ev: GameEvent, object: Npc): void {
    }
}
