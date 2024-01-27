import { Vector2 } from "../../engine/math/Vector2";
import { GameEvent } from "../../engine/events/GameEvent";
import { Object2D } from "../../engine/objects/Object2D";

export namespace TeleportToPositionGameEvent {
    export const type = "teleport_to_position";

    export class Args {
        object: Object2D;
        position: Vector2;
    }

    export function create(object: Object2D, position: Vector2) {
        return new GameEvent(
            "system",
            TeleportToPositionGameEvent.type,
            <TeleportToPositionGameEvent.Args>{
                object,
                position
            });
    }
}
