import { Cell, defaultCellDrawOptions } from "../../graphics/Cell";
import { ObjectSkin } from "../../components/ObjectSkin";
import { Grid } from "../../math/Grid";
import { LayerObject } from "./LayerObject";
import { DebugDrawOptions, defaultDebugDrawOptions } from "./DebugDrawOptions";
import { Colors } from "../../math/Colors";
import { CellSprite } from "../../data/CellSprite";

export class NumberGridObject extends LayerObject {
    constructor(
        private gridProvider: () => Grid<number | undefined>,
        private drawOptions: DebugDrawOptions = defaultDebugDrawOptions,
    ) {
        super();
        this.layer = "ui";
        this.type = "number_layer";
    }

    update(ticks: number) {
        super.update(ticks);
        this.skin = this.createSkin();
    }

    private createSkin(): ObjectSkin {
        const grid = this.gridProvider();
        return this.createSkinFromGrid(grid, this.drawOptions);
    }

    private createSkinFromGrid(
        grid: Grid<number | undefined>,
        drawOptions: DebugDrawOptions = defaultDebugDrawOptions
    ): ObjectSkin {
        const alpha = drawOptions.cellOptions.opacity || defaultCellDrawOptions.opacity;
        
        const cellLayer = grid
            .map((value, _) => createCell(value));
        return new ObjectSkin(cellLayer);

        function createCell(v: number | undefined): Cell {
            const value = v;
            if (typeof v === "undefined" && !drawOptions.drawUndefined) {
                return new Cell(CellSprite.empty, undefined, Colors.Transparent);
            }

            const textColor = typeof value !== "undefined"
                ? drawOptions.textColor(value)
                : Colors.Gray;
            const backgroundColor = typeof value !== "undefined"
                ? drawOptions.backgroundColor(value)
                : Colors.Black;
            const char = typeof v !== "undefined"
                ? v
                : ' ';
            const cell = new Cell(
                CellSprite.fromChar(char.toString(16)),
                textColor.setAlpha(alpha),
                backgroundColor.setAlpha(alpha));
            cell.options = drawOptions.cellOptions;
            return cell;
        }
    }
}
