import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { drawCell } from "../engine/graphics/GraphicsEngine";
import { Item } from "../engine/objects/Item";
import { UIElement } from "./UIElement";
import { UISceneObject } from "./UISceneObject";
import { UIText } from "./UIText";

export class UIItem extends UIElement {
    isSelected: boolean = false;
    uiObject: UISceneObject;
    uiText: UIText;

    constructor(
        parent: UIElement,
        public item: Item,
        position: [number, number]
    ) {
        super(parent);

        this.position = position;
        this.uiObject = new UISceneObject(this, item);
        this.uiText = new UIText(this, item.type, 'white', 'transparent');
        this.uiText.position = [1, 0];
    }

    draw(ctx: CanvasContext): void {
        this.drawBackground(ctx);
        super.draw(ctx);
    }

    private drawBackground(ctx: CanvasContext) {
        if (this.isSelected) {
            const [x0, y0] = this.getAbsolutePosition();
            const actualWidth = 1 + this.uiText.text.length;
            for (let x = 0; x < actualWidth; x++) {
                const borders = [
                    'white', 
                    x === actualWidth - 1 ? 'white' : '', 
                    'white', 
                    x === 0 ? 'white' : ''
                ];
                drawCell(ctx, undefined, new Cell(' '), x0 + x, y0, true, borders, "ui");
            }
        }
    }
}
