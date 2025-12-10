import { Color } from "../math/Color";
import { NormalRotation } from "../math/Rotation";
import { Cell } from "./Cell";

export interface CellInfo {
    cell: Cell;
    extraOpacity: number;
    extraBorder: { [key in NormalRotation]?: Color };
}
