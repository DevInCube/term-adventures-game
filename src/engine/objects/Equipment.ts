import { isNotNullable } from "../../utils/typing";
import { Vector2 } from "../math/Vector2";
import { Item } from "./Item";
import { Npc } from "./Npc";

// TODO: event and player message.
const itemTypeStyle = "color:blue;font-weight:bold;";
const defaultStyle = "color:black;font-weight:normal;";

export class Equipment {
    public items: Item[] = [];
    objectWearable: Item | null = null;
    objectInMainHand: Item | null = null;
    private _lastObjectInMainHand: Item | null = null;

    constructor(public object: Npc) {

    }

    public toggleEquip() {
        if (this.objectInMainHand) {
            this._lastObjectInMainHand = this.objectInMainHand;
            this.unequipObjectInMainHand();
        } else if (this._lastObjectInMainHand) {
            this.equipObjectInMainHand(this._lastObjectInMainHand);
        }
    }

    public update(ticks: number): void {
        const equipped = [this.objectWearable, this.objectInMainHand]
            .filter(isNotNullable);
        for (const item of equipped) {
            item.updateItem(ticks, this.object);
        }
    }

    public equip(item: Item) {
        // TODO: unequip wearable.
        if (item === this.objectWearable) {
            this.unequipWearable();
            return;
        }

        // TODO: wearable category.
        if ("isWearable" in item) {
            this.equipWearable(item);
            return;
        }

        // TODO: unequip handhold-equippable.
        if (item === this.objectInMainHand) {
            this.unequipObjectInMainHand();
            return;
        }

        if ("isHandheld" in item) {
            this.equipObjectInMainHand(item);
        }
        
        // TODO: equippable items categories
        //this.items.push(item);
    }

    private equipObjectInMainHand(item: Item) {
        this.unequipObjectInMainHand();
        if (!item) {
            return;
        }

        this.objectInMainHand = item;
        this.object.add(item);
        item.position = Vector2.right;

        console.log(`Equipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
    }

    private unequipObjectInMainHand() {
        const item = this.objectInMainHand;
        if (!item) {
            return;
        }
            
        this.objectInMainHand = null;
        item.removeFromParent();
        item.position = Vector2.zero;

        console.log(`Unequipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
    }

    private equipWearable(item: Item) {
        this.unequipWearable();
        if (!item) {
            return;
        }

        this.objectWearable = item;
        this.object.add(item);
        item.position = Vector2.zero;

        console.log(`Equipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
    }

    private unequipWearable() {
        const item = this.objectWearable;
        if (!item) {
            return;
        }

        this.objectWearable = null;
        item.removeFromParent();

        console.log(`Unequipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
    }
}
