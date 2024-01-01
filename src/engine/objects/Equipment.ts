import { Item } from "./Item";
import { Npc } from "./Npc";

export class Equipment {
    public items: Item[] = [];
    objectInMainHand: Item | null = null;
    objectInSecondaryHand: Item | null = null;

    constructor(public object: Npc) {

    }

    public equip(item: Item) {
        // TODO check if item is equippable and if it is handhold-equippable.
        if (item === this.objectInSecondaryHand) {
            this.objectInSecondaryHand = null;
        }

        this.objectInMainHand = item;
        item.position = [...this.object.cursorPosition];

        // TODO: event and player message.
        const itemTypeStyle = "color:blue;font-weight:bold;";
        const defaultStyle = "color:black;font-weight:normal;";
        console.log(`Equipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);

        // TODO: equippable items categories
        //this.items.push(item);
    }
}
