import { Vector2 } from "../engine/data/Vector2";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { drawCell } from "../engine/graphics/GraphicsEngine";
import { UIElement } from "./UIElement";

export class UIPanel extends UIElement {

    public borderColor: string = '#555';
    public backgroundColor: string = '#333';

    constructor(
        parent: UIElement | null,
        position: Vector2,
        size: Vector2,
    ) {
        super(parent);
        this.position = position;
        this.size = size;
    }

    draw(ctx: CanvasContext): void {
        this.drawBackgroundAndBorders(ctx);
        super.draw(ctx);
    }

    private drawBackgroundAndBorders(ctx: CanvasContext) {
        const pos = this.position;
        for (let y = 0; y < this.size.height; y++) {
            for (let x = 0; x < this.size.width; x++) {
                const localPos = new Vector2(x, y);
                const result = pos.clone().add(localPos);
                drawCell(ctx, undefined, this.getCell(localPos), result, undefined, undefined, "ui");
            }
        }
    }

    private getCell([x, y]: Vector2) {
        if (x === 0 || x === this.size.width - 1 || y === 0 || y === this.size.height - 1) {
            return new Cell(' ', 'black', this.borderColor, undefined, 15);
        } else {
            return new Cell(' ', 'white', this.backgroundColor, undefined, 15);
        }
    }
}
