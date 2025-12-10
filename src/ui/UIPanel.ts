import { Vector2 } from "../engine/math/Vector2";
import { Cell } from "../engine/graphics/Cell";
import { UIElement } from "./UIElement";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { Grid } from "../engine/math/Grid";
import { Color } from "../engine/math/Color";
import { Colors } from "../engine/math/Colors";
import { CellSprite } from "../engine/data/CellSprite";

export class UIPanel extends UIElement {

    public borderColor: Color = Color.fromHexString('#555');
    public backgroundColor: Color = Color.fromHexString('#333');

    constructor(
        parent: UIElement | null,
        position: Vector2,
        size: Vector2,
    ) {
        super(parent);
        this.position = position;
        this.size = size;
    }

    update(ticks: number): void {
        super.update(ticks);
        this.skin = this.createBackgroundAndBorders();
    }

    private createBackgroundAndBorders(): ObjectSkin {
        return new ObjectSkin(new Grid<Cell>(this.size).fill(v => this.getCell(v)));
    }

    private getCell([x, y]: Vector2) {
        const cellSprite = CellSprite.empty;
        if (x === 0 || x === this.size.width - 1 || y === 0 || y === this.size.height - 1) {
            return new Cell(cellSprite, Colors.Black, this.borderColor);
        } else {
            return new Cell(cellSprite, Colors.White, this.backgroundColor);
        }
    }
}
