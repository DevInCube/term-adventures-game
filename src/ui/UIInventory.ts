import { Camera } from "../engine/Camera";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { drawCell } from "../engine/graphics/GraphicsEngine";
import { Npc } from "../engine/objects/Npc";
import { Drawable, SceneObject } from "../engine/objects/SceneObject";
import UIItem from "./UIItem";
import UIPanel from "./UIPanel";

export default class UIInventory implements Drawable {
    uiPanel: UIPanel;
    uiItems: UIItem[] = [];
    selectedItemIndex: number = -1;

    get selectedItem() {
        return this.uiItems[this.selectedItemIndex].item;
    }

    constructor(
        public object: SceneObject,
        public camera: Camera) {

        const dialogWidth = camera.size.width;
        const dialogHeight = camera.size.height / 2 - 3;
        const position: [number, number] = [0, camera.size.height - dialogHeight];
        const size = {
            width: dialogWidth,
            height: dialogHeight,
        };
        this.uiPanel = new UIPanel(position, size);

        this.selectedItemIndex = 0;
    }

    onKeyPress(code: KeyboardEvent) {
        //console.log(code);
        const prevSelectedIndex = this.selectedItemIndex;
        switch (code.code) {
            case "KeyS":
                this.selectedItemIndex = Math.min(this.selectedItemIndex + 1, this.uiItems.length - 1);
                break;
            case "KeyW":
                this.selectedItemIndex = Math.max(this.selectedItemIndex - 1, 0);
                break;
            case "Space":
                if (this.object instanceof Npc) {
                    if (this.selectedItem === this.object.objectInSecondaryHand) {
                        this.object.objectInSecondaryHand = null;
                    }

                    this.object.objectInMainHand = this.selectedItem;
                }
        }

        //console.log({ prevSelectedIndex, newIndex : this.selectedItemIndex });
        if (prevSelectedIndex != this.selectedItemIndex) {
            this.uiItems[prevSelectedIndex].isSelected = false;
            this.uiItems[this.selectedItemIndex].isSelected = true;
        }
    }

    update() {
        this.uiItems = [];

        const top = this.uiPanel.position[1] + 1;
        let index = 0;
        for (const item of this.object.inventory.items) {
            const uiItem = new UIItem(item, [2, top + index]);
            uiItem.isSelected = index === this.selectedItemIndex; 
            this.uiItems.push(uiItem);
            index += 1;
        }
    }

    draw(ctx: CanvasContext): void {
        this.uiPanel.draw(ctx);

        for (const uiItem of this.uiItems) {
            if (this.object instanceof Npc && uiItem.item === this.object.objectInMainHand) {
                drawCell(ctx, undefined, new Cell('✋', undefined, 'transparent'), uiItem.position[0] - 1, uiItem.position[1]);
            }

            uiItem.draw(ctx);
        }
    }
}
