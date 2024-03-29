import { Cell, defaultCellDrawOptions } from "../../graphics/Cell";
import { ObjectSkin } from "../../components/ObjectSkin";
import { Grid } from "../../math/Grid";
import { LayerObject } from "./LayerObject";
import { DebugDrawOptions, defaultDebugDrawOptions } from "./DebugDrawOptions";

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
        
        const cellLayer = grid.map((value, _) => createCell(value) || new Cell(' ', undefined, 'transparent'));
        return new ObjectSkin(cellLayer);

        function createCell(v: number | undefined): Cell | undefined {
            const value = v;
            if (typeof v === "undefined" && !drawOptions.drawUndefined) {
                return undefined;
            }
            const textColor = typeof value !== "undefined"
                ? `color-mix(in srgb, ${drawOptions.textColor(value)} ${alpha * 100}%, transparent)`
                : `rgba(128, 128, 128, ${alpha})`;
            const backgroundColor = typeof value !== "undefined"
                ? `color-mix(in srgb, ${drawOptions.backgroundColor(value)} ${alpha * 100}%, transparent)`
                : `rgba(0, 0, 0, ${alpha})`;
            const char = typeof v !== "undefined"
                ? v
                : ' ';
            const cell = new Cell(char.toString(16), textColor, backgroundColor);
            cell.options = drawOptions.cellOptions;
            return cell;
        }
    }
}
