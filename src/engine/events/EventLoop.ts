import { GameEvent } from "./GameEvent";
import { GameEventHandler } from "./GameEventHandler";

const events: GameEvent[] = [];

export function eventLoop(handlers: GameEventHandler[]) {
    while (events.length > 0) {
        const ev = events.shift();
        if (!ev) {
            continue;
        }

        for (const obj of handlers) {
            obj.handleEvent(ev);
        }
    }
}

export function emitEvent(ev: GameEvent) {
    events.push(ev);
    console.log("event: ", ev);
}
