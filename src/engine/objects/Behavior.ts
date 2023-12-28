import { GameEvent } from "../events/GameEvent";
import { Npc } from "./Npc";

export interface Behavior {
    update(ticks: number, object: Npc): void;
    // TODO: use GameEventHandler separately.
    handleEvent(ev: GameEvent, object: Npc): void;
}
