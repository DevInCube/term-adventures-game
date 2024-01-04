import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { drawCell, drawObjectAt } from "../engine/graphics/GraphicsEngine";
import { Item } from "../engine/objects/Item";
import { Drawable } from "../engine/objects/SceneObject";

export default class UIItem implements Drawable {
    isSelected: boolean = false;

    constructor(
        public item: Item,
        public position: [number, number]) {
    }

    draw(ctx: CanvasContext): void {
        if (this.isSelected) {
            const borders = ['white', 'white', 'white', 'white'];
            drawCell(ctx, undefined, new Cell(' '), this.position[0], this.position[1], true, borders, "ui");
        }

        drawObjectAt(ctx, undefined, this.item, this.position, "ui");
    }
}
