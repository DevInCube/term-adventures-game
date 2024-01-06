import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { drawCell } from "../engine/graphics/GraphicsEngine";
import { UIElement } from "./UIElement";

export class UIPanel extends UIElement {

    public borderColor: string = '#555';
    public backgroundColor: string = '#333';

    constructor(
        parent: UIElement | null,
        position: [number, number],
        size: {width: number, height: number},
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
        for (let y = 0; y < this.size.height; y++) {
            const top = this.position[1] + y;
            for (let x = 0; x < this.size.width; x++) {
                const left = this.position[0] + x;
                drawCell(ctx, undefined, this.getCell([x ,y]), left, top, undefined, undefined, "ui");
            }
        }
    }

    private getCell([x, y]: [number, number]) {
        if (x === 0 || x === this.size.width - 1 || y === 0 || y === this.size.height - 1) {
            return new Cell(' ', 'black', this.borderColor, undefined, 15);
        } else {
            return new Cell(' ', 'white', this.backgroundColor, undefined, 15);
        }
    }
}
