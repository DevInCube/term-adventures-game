import { GameEvent } from "../../engine/events/GameEvent";
import { Object2D } from "../../engine/objects/Object2D";

export namespace DeathGameEvent {
    export const type = "death";

    export class Args {
        object: Object2D;
        cause: string;
        by: Object2D;
    }

    export function create(object: Object2D, cause: string, by: Object2D) {
        return new GameEvent(
            object,
            DeathGameEvent.type,
            <DeathGameEvent.Args>{
                object,
                cause,
                by,
            });
    }
}
