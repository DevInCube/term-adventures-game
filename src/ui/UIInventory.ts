import { Controls } from "../controls";
import { Camera } from "../engine/Camera";
import { emitEvent } from "../engine/events/EventLoop";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { drawCell } from "../engine/graphics/GraphicsEngine";
import { Npc } from "../engine/objects/Npc";
import { SceneObject } from "../engine/objects/SceneObject";
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
        public object: SceneObject,
        public camera: Camera
    ) {
        super(null);

        const dialogWidth = camera.size.width;
        const dialogHeight = camera.size.height / 2 - 3;
        const position: [number, number] = [0, camera.size.height - dialogHeight];
        const size = {
            width: dialogWidth,
            height: dialogHeight,
        };
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
            const uiItem = new UIItem(this.uiPanel, item, [2, 1 + index]);
            uiItem.isSelected = index === this.selectedItemIndex; 
            this.uiItems.push(uiItem);
            index += 1;
        }
    }

    draw(ctx: CanvasContext): void {
        super.draw(ctx);

        for (const uiItem of this.uiItems) {
            if (this.object instanceof Npc) {
                if (uiItem.item === this.object.equipment.objectInMainHand) {
                    const [x, y] = uiItem.getAbsolutePosition();
                    const cursorCell = new Cell('✋', undefined, 'transparent');
                    drawCell(ctx, undefined, cursorCell, x - 1, y, undefined, undefined, "ui");
                } else if (uiItem.item === this.object.equipment.objectWearable) {
                    const [x, y] = uiItem.getAbsolutePosition();
                    const cursorCell = new Cell('👕', undefined, 'transparent');
                    drawCell(ctx, undefined, cursorCell, x - 1, y, undefined, undefined, "ui");
                }
            }
        }
    }
}
