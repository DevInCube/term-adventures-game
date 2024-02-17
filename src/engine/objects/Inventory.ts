import { Item } from "./Item";

export class Inventory {
    public items: Item[] = [];

    public addItems(newItems: Item[]) {
        this.items.push(...newItems);
    }
}