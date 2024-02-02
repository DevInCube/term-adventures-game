import { Vector2 } from "../engine/math/Vector2";
import { Cell } from "../engine/graphics/Cell";
import { UIElement } from "./UIElement";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { Grid } from "../engine/math/Grid";

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

    update(ticks: number): void {
        super.update(ticks);
        this.skin = this.createBackgroundAndBorders();
    }

    private createBackgroundAndBorders(): ObjectSkin {
        return new ObjectSkin(new Grid<Cell>(this.size).fill(v => this.getCell(v)));
    }

    private getCell([x, y]: Vector2) {
        if (x === 0 || x === this.size.width - 1 || y === 0 || y === this.size.height - 1) {
            return new Cell(' ', 'black', this.borderColor);
        } else {
            return new Cell(' ', 'white', this.backgroundColor);
        }
    }
}
