import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { drawCell } from "../engine/graphics/GraphicsEngine";
import { Drawable } from "../engine/objects/SceneObject";

export default class UIPanel implements Drawable {
    constructor(
        public position: [number, number],
        public size: {width: number, height: number}) {

    }

    draw(ctx: CanvasContext): void {
        for (let y = 0; y < this.size.height; y++) {
            const top = this.position[1] + y;
            for (let x = 0; x < this.size.width; x++) {
                const left = this.position[0] + x;
                if (x === 0 || x === this.size.width - 1 || y === 0 || y === this.size.height - 1)
                    drawCell(ctx, undefined, new Cell(' ', 'black', '#555', undefined, 15), left, top);
                else 
                    drawCell(ctx, undefined, new Cell(' ', 'white', '#333', undefined, 15), left, top);
            }
        }
    }
}
