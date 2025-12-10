import { Vector2 } from "../math/Vector2";
import { Cell, CellDrawOptions } from "../graphics/Cell";
import { Grid } from "../math/Grid";
import { Color } from "../math/Color";
import { Colors } from "../math/Colors";
import { CellSprite } from "../data/CellSprite";

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

        const cell = this.cells.at(position);
        if (typeof cell === "undefined") {
            return true;
        }

        return cell.isEmpty;
    }

    public getCellsAt(position: Vector2): Cell[] {
        const cell = this.cells.at(position);
        if (!cell) {
            return [];
        }

        return [cell];
    }

    public char(options: string, position: Vector2 = new Vector2()) {
        this.getCellAt(position).character = CellSprite.fromChar(options);
        return this;
    }

    public color(options: Color, position: Vector2 = new Vector2()) {
        this.getCellAt(position).textColor = options;
        return this;
    }

    public background(options: Color, position: Vector2 = new Vector2()) {
        this.getCellAt(position).backgroundColor = options;
        return this;
    }

    public option(options: CellDrawOptions, position: Vector2 = new Vector2()) {
        const cell = this.getCellAt(position);
        cell.options = {...cell.options, ...options};
        return this; 
    }

    public getPositions(): Vector2[] {
        const positions: Vector2[] = [];
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                if (this.isEmptyCellAt(new Vector2(x, y))) {
                    continue;
                }

                positions.push(new Vector2(x, y));
            }
        }
        
        return positions;
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
        return new Cell(CellSprite.empty, undefined, Colors.Transparent);
    }
}
