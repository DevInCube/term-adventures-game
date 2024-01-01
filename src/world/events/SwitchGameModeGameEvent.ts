import { GameEvent } from "../../engine/events/GameEvent";

export namespace SwitchGameModeGameEvent {
    export const type = "switch_mode";

    export class Args {
        from: string;
        to: string;
    }

    export function create(from: string, to: string) {
        return new GameEvent("system", SwitchGameModeGameEvent.type, <SwitchGameModeGameEvent.Args>{ from, to });
    }
}
