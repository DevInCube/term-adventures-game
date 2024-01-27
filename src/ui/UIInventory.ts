import { Controls } from "../controls";
import { Camera } from "../engine/Camera";
import { Vector2 } from "../engine/math/Vector2";
import { emitEvent } from "../engine/events/EventLoop";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { drawCell } from "../engine/graphics/GraphicsEngine";
import { Item } from "../engine/objects/Item";
import { Npc } from "../engine/objects/Npc";
import { Object2D } from "../engine/objects/Object2D";
import { SwitchGameModeGameEvent } from "../world/events/SwitchGameModeGameEvent";
import { UIElement } from "./UIElement";
import { UIItem } from "./UIItem";
import { UIPanel } from "./UIPanel";

export class UIInventory extends UIElement {
    uiPanel: UIPanel;
    uiItems: UIItem[] = [];
    selectedItemIndex: number = -1;

    get selectedItem() {
        return this.uiItems[this.selectedItemIndex].item;
    }

    constructor(
        public object: Object2D,
        public camera: Camera
    ) {
        super(null);

        const dialogWidth = camera.size.width;
        const dialogHeight = camera.size.height / 2 - 3;
        const position = new Vector2(0, camera.size.height - dialogHeight);
        const size = new Vector2(dialogWidth, dialogHeight);
        this.uiPanel = new UIPanel(this, position, size);

        this.selectedItemIndex = 0;
    }

    handleControls() {
        const prevSelectedIndex = this.selectedItemIndex;

        if (Controls.Down.isDown && !Controls.Down.isHandled) {
            this.selectedItemIndex = Math.min(this.selectedItemIndex + 1, this.uiItems.length - 1);
            Controls.Down.isHandled = true;
        }
        
        if (Controls.Up.isDown && !Controls.Up.isHandled) {
            this.selectedItemIndex = Math.max(this.selectedItemIndex - 1, 0);
            Controls.Up.isHandled = true;
        }

        if (Controls.Interact.isDown && !Controls.Interact.isHandled) {
            if (this.object instanceof Npc) {
                this.object.equipment.equip(this.selectedItem);
            }
            Controls.Interact.isHandled = true;
        }

        if (Controls.Inventory.isDown && !Controls.Inventory.isHandled) {
            emitEvent(SwitchGameModeGameEvent.create("inventory", "scene"));
            Controls.Inventory.isHandled = true;
        }

        if (prevSelectedIndex != this.selectedItemIndex) {
            this.uiItems[prevSelectedIndex].isSelected = false;
            this.uiItems[this.selectedItemIndex].isSelected = true;
        }
    }

    update() {
        this.uiItems = [];
        for (const child of [...this.uiPanel.children]) {
            this.uiPanel.remove(child)
        }

        let index = 0;
        for (const item of this.object.inventory.items) {
            const uiItem = new UIItem(this.uiPanel, item, new Vector2(2, 1 + index));
            uiItem.isSelected = index === this.selectedItemIndex; 
            this.uiItems.push(uiItem);
            index += 1;
        }
    }

    draw(ctx: CanvasContext): void {
        super.draw(ctx);

        for (const uiItem of this.uiItems) {
            if (this.object instanceof Npc) {
                const cursorCell = createEquipmentCell(uiItem.item, this.object);
                if (cursorCell) {
                    const pos = uiItem.getAbsolutePosition();
                    const position = pos.clone().add(new Vector2(-1, 0));
                    drawCell(ctx, undefined, cursorCell, position, undefined, undefined, "ui");
                }
            }
        }

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
