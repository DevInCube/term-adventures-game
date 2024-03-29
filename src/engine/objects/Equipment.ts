import { isNotNullable } from "../../utils/typing";
import { Effect } from "../effects/Effect";
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
    ring: Item | null = null;
    private _lastObjectInMainHand: Item | null = null;

    constructor(public object: Npc) {

    }

    public getEquippedItems(): Item[] {
        const equipped = [this.objectWearable, this.objectInMainHand, this.ring]
            .filter(isNotNullable);
        return equipped;
    }

    public getEffects(): Effect[] {
        return this.getEquippedItems().flatMap(x => x.effects);
    }

    public toggleHandheldEquip() {
        if (this.objectInMainHand) {
            this._lastObjectInMainHand = this.objectInMainHand;
            this.unequipObjectInMainHand();
        } else if (this._lastObjectInMainHand) {
            this.equipObjectInMainHand(this._lastObjectInMainHand);
        }
    }

    public equip(item: Item) {
        if ("isWearable" in item) {
            if (item === this.objectWearable) {
                this.unequipWearable();
                return;
            }

            this.equipWearable(item);
            return;
        }

        if ("isHandheld" in item) {
            if (item === this.objectInMainHand) {
                this.unequipObjectInMainHand();
                return;
            }

            this.equipObjectInMainHand(item);
            return;
        }

        if ("isRing" in item) {
            if (item === this.ring) {
                this.unequipRing();
                return;
            }

            this.equipRing(item);
            return;
        }
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
        this.printEffects(item);
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
        this.printEffects(item);
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

    private equipRing(item: Item) {
        this.unequipRing();
        if (!item) {
            return;
        }

        this.ring = item;
        this.object.add(item);
        item.position = Vector2.zero;

        console.log(`Equipped %c${item.type}%c as ring object.`, itemTypeStyle, defaultStyle);
        this.printEffects(item);
    }

    private unequipRing() {
        const item = this.ring;
        if (!item) {
            return;
        }

        this.ring = null;
        item.removeFromParent();

        console.log(`Unequipped %c${item.type}%c as ring object.`, itemTypeStyle, defaultStyle);
    }

    private printEffects(item: Item) {
        for (const effect of item.effects) {
            console.log(`Effect: ${effect.name}.${effect.type} (${effect.value})`, effect);
        }
    }
}
