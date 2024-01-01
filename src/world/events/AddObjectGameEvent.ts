import { GameEvent } from "../../engine/events/GameEvent";
import { SceneObject } from "../../engine/objects/SceneObject";

export namespace AddObjectGameEvent {
    export const type = "add_object";

    export class Args {
        object: SceneObject;
    }

    export function create(object: SceneObject) {
        return new GameEvent("system", AddObjectGameEvent.type, <AddObjectGameEvent.Args>{ object });
    }
}
