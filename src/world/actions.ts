import { emitEvent } from "../engine/events/EventLoop";
import { GameObjectActionContext } from "../engine/objects/SceneObject";
import { StaticGameObject } from "../engine/objects/StaticGameObject";
import { PlayerMessageGameEvent } from "./events/PlayerMessageGameEvent";
import { TransferItemsGameEvent } from "./events/TransferItemsGameEvent";

export function storageAction(obj: StaticGameObject){
    
    return (ctx: GameObjectActionContext) => {
        const items = obj.inventory.items;
        if (items.length === 0) {
            emitEvent(PlayerMessageGameEvent.create("Chest is empty."));
            return;
        }

        obj.inventory.items = [];
        emitEvent(TransferItemsGameEvent.create(ctx.initiator, items));
    }
}