import { GameEvent } from "../../engine/events/GameEvent";
import { Item } from "../../engine/objects/Item";
import { Npc } from "../../engine/objects/Npc";

export namespace TransferItemsGameEvent {
    export const type = "transfer_items";

    export class Args {
        recipient: Npc;
        items: Item[];
    }

    export function create(recipient: Npc, items: Item[]) {
        return new GameEvent(
            recipient,
            TransferItemsGameEvent.type,
            <TransferItemsGameEvent.Args>{
                recipient,
                items,
            });
    }
}
