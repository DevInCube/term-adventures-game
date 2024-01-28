import { Vector2 } from "../math/Vector2";
import { Cell } from "../graphics/Cell";

export class ObjectSkin {

    public get size(): Vector2 {
        return new Vector2(this.cells[0]?.length || 0, this.cells.length);
    }

    constructor(
        private cells: Cell[][] = [],
    ) {
        if (!cells) {
            throw new Error('Cells grid is empty.');
        }
    }

    public setForegroundAt([x, y]: [number, number], foreground: string): void {
        this.cells[y][x].textColor = foreground;
    }

    public setBackgroundAt([x, y]: [number, number], background: string): void {
        this.cells[y][x].backgroundColor = background;
    }

    public isEmptyCellAt([x, y]: Vector2): boolean {
        if (x < 0 || y < 0 || y >= this.cells.length || x >= this.cells[y].length) {
            return true;
        }

        return this.cells[y][x].isEmpty;
    }

    public getCellsAt([x, y]: Vector2): Cell[] {
        const cell = this.cells?.[y]?.[x];
        if (!cell) {
            // TODO: why?
            //console.error(`Cell is not defined at ${x},${y}.`);
            return [];
        }

        return [cell];
    }
}
