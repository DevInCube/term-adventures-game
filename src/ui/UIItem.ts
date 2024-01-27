import { Vector2 } from "../engine/math/Vector2";
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
        position: Vector2
    ) {
        super(parent);

        this.position = position;
        this.uiObject = new UISceneObject(this, item);
        this.uiText = new UIText(this, item.type, 'white', 'transparent');
        this.uiText.position = new Vector2(1, 0);
    }

    draw(ctx: CanvasContext): void {
        this.drawBackground(ctx);
        super.draw(ctx);
    }

    private drawBackground(ctx: CanvasContext) {
        if (this.isSelected) {
            const pos0 = this.getAbsolutePosition();
            const actualWidth = 1 + this.uiText.text.length;
            for (let x = 0; x < actualWidth; x++) {
                const borders = [
                    'white', 
                    x === actualWidth - 1 ? 'white' : '', 
                    'white', 
                    x === 0 ? 'white' : ''
                ];
                const newPos = pos0.clone().add(new Vector2(x, 0))
                drawCell(ctx, undefined, new Cell(' '), newPos, 0.2, borders, "ui");
            }
        }
    }
}
