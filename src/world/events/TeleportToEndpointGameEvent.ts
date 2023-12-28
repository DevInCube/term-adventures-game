import { GameEvent } from "../../engine/events/GameEvent";
import { SceneObject } from "../../engine/objects/SceneObject";

export namespace TeleportToEndpointGameEvent {
    export const type = "teleport_to_endpoint"; 

    export class Args {
        id: string;
        teleport: SceneObject;
        object: SceneObject;
    }

    export function create(id: string, teleport: SceneObject, object: SceneObject) {
        return new GameEvent(
            teleport, 
            TeleportToEndpointGameEvent.type,
            <TeleportToEndpointGameEvent.Args>{
                id,
                teleport,
                object,
            })
    }
}
