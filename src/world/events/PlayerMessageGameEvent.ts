import { GameEvent } from "../../engine/events/GameEvent";

export namespace PlayerMessageGameEvent {
    export const type = "player_message";

    export class Args {
        message: string;
    }

    export function create(message: string) {
        return new GameEvent(null, PlayerMessageGameEvent.type, <PlayerMessageGameEvent.Args>{ message });
    }
}
