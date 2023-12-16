import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";

export default class Chest extends StaticGameObject {
    constructor(position: [number, number]) {
        super(
            [0, 0], 
            new ObjectSkin(`🧰`, `.`, {
                '.': [undefined, 'transparent'],
            }),
            new ObjectPhysics(`.`, ''),
            position);

        this.setAction(0, 0, (ctx) => {
            const items = this.inventory.items;
            if (items.length === 0) {
                console.log("Chest is empty.");
                // TODO: emit player message event.
            }
            this.inventory.items = [];
            ctx.initiator.inventory.addItems(items);
        });
    }
}

export const chest = () => new Chest([2, 10]);
