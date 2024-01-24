import { Vector2 } from "../../engine/data/Vector2";
import { GameEvent } from "../../engine/events/GameEvent";
import { SceneObject } from "../../engine/objects/SceneObject";

export namespace TeleportToPositionGameEvent {
    export const type = "teleport_to_position";

    export class Args {
        object: SceneObject;
        position: Vector2;
    }

    export function create(object: SceneObject, position: Vector2) {
        return new GameEvent(
            "system",
            TeleportToPositionGameEvent.type,
            <TeleportToPositionGameEvent.Args>{
                object,
                position
            });
    }
}
