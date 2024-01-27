import { GameEvent } from "../../engine/events/GameEvent";
import { Object2D } from "../../engine/objects/Object2D";

export namespace RemoveObjectGameEvent {
    export const type = "remove_object";

    export class Args {
        object: Object2D;
    }

    export function create(object: Object2D) {
        return new GameEvent("system", RemoveObjectGameEvent.type, <RemoveObjectGameEvent.Args>{ object });
    }
}
