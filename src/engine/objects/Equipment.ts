import { Vector2 } from "../math/Vector2";
import { Item } from "./Item";
import { Npc } from "./Npc";

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

    public equip(item: Item) {
        // TODO: event and player message.
        const itemTypeStyle = "color:blue;font-weight:bold;";
        const defaultStyle = "color:black;font-weight:normal;";

        // TODO: unequip wearable.
        if (item === this.objectWearable) {
            this.objectWearable = null;
            item.removeFromParent();

            console.log(`Unequipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
            return;
        }

        // TODO: wearable category.
        if (item.type === "glasses") {
            this.objectWearable = item;
            this.object.add(item);
            item.position = Vector2.zero;

            console.log(`Equipped %c${item.type}%c as wearable object.`, itemTypeStyle, defaultStyle);
            return;
        }

        // TODO: unequip handhold-equippable.
        if (item === this.objectInMainHand) {
            this.unequipObjectInMainHand();
            return;
        }

        this.equipObjectInMainHand(item);
        
        // TODO: equippable items categories
        //this.items.push(item);
    }

    private equipObjectInMainHand(item: Item) {
        // TODO: event and player message.
        const itemTypeStyle = "color:blue;font-weight:bold;";
        const defaultStyle = "color:black;font-weight:normal;";

        this.unequipObjectInMainHand();
        
        if (item) {
            this.objectInMainHand = item;
            this.object.add(item);
            item.position = this.object.direction.clone();
    
            console.log(`Equipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
        }
    }

    private unequipObjectInMainHand() {
        // TODO: event and player message.
        const itemTypeStyle = "color:blue;font-weight:bold;";
        const defaultStyle = "color:black;font-weight:normal;";

        const item = this.objectInMainHand;
        if (item) {
            this.objectInMainHand = null;
            item.removeFromParent();
            item.position = Vector2.zero;
    
            console.log(`Unequipped %c${item.type}%c as object in main hand.`, itemTypeStyle, defaultStyle);
        }
    }
}
