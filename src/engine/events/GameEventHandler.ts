import { GameEvent } from "./GameEvent";


export interface GameEventHandler {
    handleEvent(ev: GameEvent): void;
}
