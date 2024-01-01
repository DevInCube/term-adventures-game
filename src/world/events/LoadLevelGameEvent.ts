import { Level } from "../../engine/Level";
import { GameEvent } from "../../engine/events/GameEvent";

export namespace LoadLevelGameEvent {
    export const type = "load_level";

    export class Args {
        level: Level;
    }

    export function create(level: Level) {
        return new GameEvent("system", LoadLevelGameEvent.type, <LoadLevelGameEvent.Args>{ level });
    }
}
