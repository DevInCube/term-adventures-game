import { Item } from "./Item";

export class Inventory {
    public items: Item[] = [];

    public addItems(newItems: Item[]) {
        for (const newItem of newItems) {
            this.items.push(newItem);
        }
    }
}