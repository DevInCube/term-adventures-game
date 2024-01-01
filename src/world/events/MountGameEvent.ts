import { GameEvent } from "../../engine/events/GameEvent";
import { Npc } from "../../engine/objects/Npc";

export namespace MountGameEvent {
    export const type = "mount";

    export type MountState = "mounted" | "unmounted";

    export class Args {
        mounter: Npc;
        mount: Npc;
        newState: MountState;
    }

    export function create(mounter: Npc, mount: Npc, newState: MountState) {
        return new GameEvent(
            mounter,
            MountGameEvent.type,
            <MountGameEvent.Args>{
                mounter,
                mount,
                newState,
            });
    }
}
