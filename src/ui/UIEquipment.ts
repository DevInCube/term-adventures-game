import { Vector2 } from "../engine/math/Vector2";
import { Cell } from "../engine/graphics/Cell";
import { Item } from "../engine/objects/Item";
import { Npc } from "../engine/objects/Npc";
import { UIElement } from "./UIElement";
import { UIItem } from "./UIItem";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { Grid } from "../engine/math/Grid";

export class UIEquipment extends UIElement {
    constructor(
        parent: UIElement,
        private object: Npc,
        private uiItems: UIItem[]
    ) {
        super(parent);
    }

    update(ticks: number): void {
        super.update(ticks);
        this.skin = this.createEquipmentSkin();
    }

    private createEquipmentSkin(): ObjectSkin {
        const defaultCell = new Cell(' ', undefined, 'transparent');
        const cells = new Grid<Cell>(new Vector2(1, this.uiItems.length))
            .fill(v => createEquipmentCell(this.uiItems[v.y].item, this.object) || defaultCell);
        return new ObjectSkin(cells);

        function createEquipmentCell(item: Item, object: Npc) {
            if (item === object.equipment.objectInMainHand) {
                return new Cell('✋', undefined, 'transparent');
            } else if (item === object.equipment.objectWearable) {
                return new Cell('👕', undefined, 'transparent');
            }

            return undefined;
        }
    }
}
