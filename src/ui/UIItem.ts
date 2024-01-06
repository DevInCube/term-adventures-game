import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { drawCell } from "../engine/graphics/GraphicsEngine";
import { Item } from "../engine/objects/Item";
import { UIElement } from "./UIElement";
import { UISceneObject } from "./UISceneObject";

export class UIItem extends UIElement {
    isSelected: boolean = false;
    uiObject: UISceneObject;

    constructor(
        parent: UIElement,
        public item: Item,
        position: [number, number]
    ) {
        super(parent);

        this.position = position;
        this.uiObject = new UISceneObject(this, item);
    }

    draw(ctx: CanvasContext): void {
        this.drawBackground(ctx);
        super.draw(ctx);
    }

    private drawBackground(ctx: CanvasContext) {
        if (this.isSelected) {
            const borders = ['white', 'white', 'white', 'white'];
            const [x, y] = this.getAbsolutePosition();
            drawCell(ctx, undefined, new Cell(' '), x, y, true, borders, "ui");
        }
    }
}
