import { numberToHexColor } from "../../../utils/color";
import { CellDrawOptions } from "../../graphics/Cell";
import { Vector2 } from "../../math/Vector2";

export type DebugDrawOptions = {
    drawUndefined: boolean;
    textColor: (value: number) => string;
    backgroundColor: (value: number) => string;
    cellOptions: CellDrawOptions;
};

export const defaultDebugDrawOptions: DebugDrawOptions = {
    drawUndefined: false,
    textColor: _ => `white`,
    backgroundColor: v => numberToHexColor(v, 15, 0),
    cellOptions: {
        bold: false,
        miniCellPosition: Vector2.zero,
        opacity: 0.5,
        scale: 1,
        border: undefined,
    },
};