import { GameMode } from "../../GameMode";
import { GameEvent } from "../../engine/events/GameEvent";

export namespace SwitchGameModeGameEvent {
    export const type = "switch_mode";

    export class Args {
        from: GameMode;
        to: GameMode;
    }

    export function create(from: GameMode, to: GameMode) {
        return new GameEvent("system", SwitchGameModeGameEvent.type, <SwitchGameModeGameEvent.Args>{ from, to });
    }
}
