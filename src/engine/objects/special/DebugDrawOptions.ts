import { numberToColor } from "../../../utils/color";
import { CellDrawOptions } from "../../graphics/Cell";
import { Color } from "../../math/Color";
import { Colors } from "../../math/Colors";
import { Vector2 } from "../../math/Vector2";

export type DebugDrawOptions = {
    drawUndefined: boolean;
    textColor: (value: number) => Color;
    backgroundColor: (value: number) => Color;
    cellOptions: CellDrawOptions;
};

export const defaultDebugDrawOptions: DebugDrawOptions = {
    drawUndefined: false,
    textColor: _ => Colors.White,
    backgroundColor: v => numberToColor(v, 15, 0),
    cellOptions: {
        bold: false,
        miniCellPosition: Vector2.zero,
        opacity: 0.5,
        scale: 1,
        border: undefined,
    },
};