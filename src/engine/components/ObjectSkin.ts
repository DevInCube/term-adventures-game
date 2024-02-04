import { Vector2 } from "../math/Vector2";
import { Cell } from "../graphics/Cell";
import { Grid } from "../math/Grid";

export class ObjectSkin {
    static defaultSize = new Vector2(1, 1);

    public get size(): Vector2 {
        return this.cells.size;
    }

    constructor(
        private cells: Grid<Cell> = new Grid<Cell>(ObjectSkin.defaultSize),
    ) {
    }

    public isEmptyCellAt(position: Vector2): boolean {
        if (!this.cells.containsPosition(position)) {
            return true;
        }

        return this.cells.at(position).isEmpty;
    }

    public getCellsAt(position: Vector2): Cell[] {
        const cell = this.cells.at(position);
        if (!cell) {
            // TODO: why?
            //console.error(`Cell is not defined at ${x},${y}.`);
            return [];
        }

        return [cell];
    }

    public char(options: string, position: Vector2 = new Vector2()) {
        this.getCellAt(position).character = options;
        return this;
    }

    public color(options: string, position: Vector2 = new Vector2()) {
        this.getCellAt(position).textColor = options;
        return this;
    }

    public background(options: string, position: Vector2 = new Vector2()) {
        this.getCellAt(position).backgroundColor = options;
        return this;
    }

    private getCellAt(position: Vector2 = new Vector2()): Cell {
        if (!this.cells.containsPosition(position)) {
            return ObjectSkin.createDefaultCell();
        }

        const cell = this.cells.at(position);
        if (!cell) {
            const newCell = ObjectSkin.createDefaultCell();
            this.cells.setAt(position, newCell);
            return newCell;
        }

        return cell;
    }

    private static createDefaultCell() {
        return new Cell(' ', undefined, 'transparent');
    }
}
