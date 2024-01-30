import { Vector2 } from "../../math/Vector2";
import { Cell, CellDrawOptions } from "../../graphics/Cell";
import { Object2D } from "../Object2D";
import * as utils from "../../../utils/layer";
import { ObjectSkin } from "../../components/ObjectSkin";
import { numberToHexColor } from "../../../utils/color";

export class NumberLayerObject extends Object2D {
    constructor(
        private layerProvider: () => (number | undefined)[][],
        private drawOptions: DebugDrawOptions = defaultDebugDrawOptions) {
        super();
        this.layer = "ui";
        this.type = "number_layer";
    }

    update(ticks: number) {
        super.update(ticks);
        this.skin = this.createSkin();
    }

    private createSkin(): ObjectSkin {
        const layer = this.layerProvider();
        return this.createSkinFromLayer(layer, this.drawOptions);
    }

    private createSkinFromLayer(layer: (number | undefined)[][], drawOptions: DebugDrawOptions = defaultDebugDrawOptions): ObjectSkin {
        const alpha = drawOptions.cellOptions.opacity;
        
        const cellLayer = utils.mapLayer(layer, (value, _) => createCell(value) || new Cell(' ', undefined, 'transparent'));
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

export type DebugDrawOptions = {
    drawUndefined: boolean,
    textColor: (value: number) => string,
    backgroundColor: (value: number) => string,
    cellOptions: CellDrawOptions,
};

const defaultDebugDrawOptions: DebugDrawOptions = {
    drawUndefined: false,
    textColor: _ => `gray`,
    backgroundColor: v => numberToHexColor(v, 15, 0),
    cellOptions: {
        bold: false,
        miniCellPosition: Vector2.zero,
        opacity: 0.5,
        scale: 1,
        border: undefined,
    },
};