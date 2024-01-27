import { GameEvent } from "../../engine/events/GameEvent";
import { Object2D } from "../../engine/objects/Object2D";

export namespace TeleportToEndpointGameEvent {
    export const type = "teleport_to_endpoint"; 

    export class Args {
        id: string;
        teleport: Object2D;
        object: Object2D;
    }

    export function create(id: string, teleport: Object2D, object: Object2D) {
        return new GameEvent(
            teleport, 
            TeleportToEndpointGameEvent.type,
            <TeleportToEndpointGameEvent.Args>{
                id,
                teleport,
                object,
            });
    }
}
