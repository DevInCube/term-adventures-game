import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { PlayerMessageGameEvent } from "../events/PlayerMessageGameEvent";
import { emitEvent } from "../../engine/events/EventLoop";
import { TransferItemsGameEvent } from "../events/TransferItemsGameEvent";

export default class Chest extends StaticGameObject {
    constructor(position: [number, number]) {
        super(
            [0, 0], 
            new ObjectSkin(`🧰`, `.`, {
                '.': [undefined, 'transparent'],
            }),
            new ObjectPhysics(`.`, ''),
            position);

        this.setAction((ctx) => {
            const items = this.inventory.items;
            if (items.length === 0) {
                emitEvent(PlayerMessageGameEvent.create("Chest is empty."));
                return;
            }

            this.inventory.items = [];
            emitEvent(TransferItemsGameEvent.create(ctx.initiator, items));
        });
    }
}

export const chest = () => new Chest([2, 10]);
