import { Item } from "./Item";
import { Npc } from "./Npc";

export class Equipment {
    public items: Item[] = [];
    objectWearable: Item | null = null;
    objectInMainHand: Item | null = null;
    objectInSecondaryHand: Item | null = null;

    get objects() {
        return [
            this.objectWearable,
            this.objectInMainHand,
            this.objectInSecondaryHand,
        ];
    }

    constructor(public object: Npc) {

    }

    public equip(item: Item) {
        // TODO: event and player message.
        const itemTypeStyle = "color:blue;font-weight:bold;";
        const defaultStyle = "color:black;font-weight:normal;";

        // TODO: unequip wearable.
        if (item === this.objectWearable) {
            this.objectWearable = null;
            item.parent = null;

            console.log(`Unequipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
            return;
        }

        // TODO: wearable category.
        if (item.type === "glasses") {
            this.objectWearable = item;
            item.parent = this.object;
            item.position = [0, 0];

            console.log(`Equipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
            return;
        }

        // TODO: unequip handhold-equippable.
        if (item === this.objectInMainHand) {
            this.objectInMainHand = null;
            item.parent = null;
            item.position = [0, 0];

            console.log(`Unequipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
            return;
        }

        // TODO: check if item is equippable and if it is handhold-equippable.
        if (item === this.objectInSecondaryHand) {
            this.objectInSecondaryHand = null;
            item.parent = null;
            item.position = [0, 0];
        }

        // Equip object in hand.
        this.objectInMainHand = item;
        item.parent = this.object;
        item.position = [...this.object.direction];

        console.log(`Equipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);

        // TODO: equippable items categories
        //this.items.push(item);
    }
}
