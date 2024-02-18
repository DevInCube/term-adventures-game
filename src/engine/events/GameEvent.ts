import { GameEventHandler } from "./GameEventHandler";

export class GameEvent {

    constructor(
        public sender: GameEventHandler | string | null,
        public type: string, 
        public args: {[key: string]: any},
    ) {

    }
}
