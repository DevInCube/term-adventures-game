import { Scene } from "../Scene";
import { GameEvent } from "../events/GameEvent";
import { Npc } from "./Npc";

export interface Behavior {
    update(ticks: number, scene: Scene, object: Npc): void;
    // TODO: use GameEventHandler separately.
    handleEvent(ev: GameEvent, object: Npc): void;
}
