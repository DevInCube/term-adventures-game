import { GameEvent } from "../../engine/events/GameEvent";
import { Object2D } from "../../engine/objects/Object2D";

export namespace AddObjectGameEvent {
    export const type = "add_object";

    export class Args {
        object: Object2D;
    }

    export function create(object: Object2D) {
        return new GameEvent("system", AddObjectGameEvent.type, <AddObjectGameEvent.Args>{ object });
    }
}
