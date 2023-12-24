import { Camera } from "../engine/Camera";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Drawable, SceneObject } from "../engine/objects/SceneObject";
import UIItem from "./UIItem";
import UIPanel from "./UIPanel";

export default class UIInventory implements Drawable {
    uiPanel: UIPanel;
    uiItems: UIItem[] = [];
    selectedItemIndex: number = -1;

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

    draw(ctx: CanvasContext): void {
        this.uiPanel.draw(ctx);

        const top = this.uiPanel.position[1] + 1;
        let index = 0;
        for (const item of this.object.inventory.items) {
            const uiItem = new UIItem(item, [2, top + index]);
            uiItem.isSelected = index === this.selectedItemIndex; 
            uiItem.draw(ctx);
            index += 1;
        }
    }
}
