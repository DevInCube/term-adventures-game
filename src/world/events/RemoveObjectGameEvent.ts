import { GameEvent } from "../../engine/events/GameEvent";
import { SceneObject } from "../../engine/objects/SceneObject";

export namespace RemoveObjectGameEvent {
    export const type = "remove_object";

    export class Args {
        object: SceneObject;
    }

    export function create(object: SceneObject) {
        return new GameEvent("system", RemoveObjectGameEvent.type, <RemoveObjectGameEvent.Args>{ object });
    }
}
