import { Item } from "./Item";

export class Equipment {
    public items: Item[] = [];
    objectInMainHand: Item | null = null;
    objectInSecondaryHand: Item | null = null;

    public equip(item: Item) {
        // TODO check if item is equippable and if it is handhold-equippable.
        if (item === this.objectInSecondaryHand) {
            this.objectInSecondaryHand = null;
        }

        this.objectInMainHand = item;

        // TODO
        //this.items.push(item);
    }
}
