import { Vector2 } from "../engine/math/Vector2";
import { Cell } from "../engine/graphics/Cell";
import { Item } from "../engine/objects/Item";
import { Npc } from "../engine/objects/Npc";
import { UIElement } from "./UIElement";
import { UIItem } from "./UIItem";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { Grid } from "../engine/math/Grid";
import { EquipmentTags } from "../engine/objects/EquipmentTags";
import { Colors } from "../engine/math/Colors";
import { Color } from "../engine/math/Color";
import { CellSprite } from "../engine/data/CellSprite";

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
        const defaultCell = new Cell(CellSprite.empty, undefined, Colors.Transparent);
        const cells = new Grid<Cell>(new Vector2(1, this.uiItems.length))
            .fill(v => {
                const uiItem = this.uiItems[v.y];
                const item = uiItem.item;
                const isSelected = uiItem.isSelected;
                return (
                    createEquipmentCell(item, this.object) ||
                    (isSelected ? createEquipmentCategoryCell(item) : undefined) ||
                    defaultCell
                );
            });
        return new ObjectSkin(cells);

        function createEquipmentCell(item: Item, object: Npc) {
            if (item === object.equipment.objectInMainHand) {
                return new Cell(CellSprite.fromChar('✋'), undefined, Colors.Transparent);
            } else if (item === object.equipment.objectWearable) {
                return new Cell(CellSprite.fromChar('👕'), undefined, Colors.Transparent);
            } else if (item === object.equipment.ring) {
                return new Cell(CellSprite.fromChar('⭕'), undefined, Colors.Transparent);
            } else if (item === object.equipment.objectSpecial) {
                return new Cell(CellSprite.fromChar('💎'), undefined, Colors.Transparent);
            }

            return undefined;
        }

        function createEquipmentCategoryCell(item: Item) {
            const color = new Color(Colors.Black).setAlpha(0x22 / 0xff);
            if (EquipmentTags.isHandheld in item) {
                return new Cell(CellSprite.fromChar('✋'), color, Colors.Transparent);
            } else if (EquipmentTags.isWearable in item) {
                return new Cell(CellSprite.fromChar('👕'), color, Colors.Transparent);
            } else if (EquipmentTags.isRing in item) {
                return new Cell(CellSprite.fromChar('⭕'), color, Colors.Transparent);
            } else if (EquipmentTags.isSpecial in item) {
                return new Cell(CellSprite.fromChar('💎'), color, Colors.Transparent);
            }

            return undefined;
        }
    }
}
