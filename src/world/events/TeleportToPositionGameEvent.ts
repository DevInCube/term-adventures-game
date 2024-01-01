import { GameEvent } from "../../engine/events/GameEvent";
import { SceneObject } from "../../engine/objects/SceneObject";

export namespace TeleportToPositionGameEvent {
    export const type = "teleport_to_position";

    export class Args {
        object: SceneObject;
        position: [number, number];
    }

    export function create(object: SceneObject, position: [number, number]) {
        return new GameEvent(
            "system",
            TeleportToPositionGameEvent.type,
            <TeleportToPositionGameEvent.Args>{
                object,
                position
            });
    }
}
