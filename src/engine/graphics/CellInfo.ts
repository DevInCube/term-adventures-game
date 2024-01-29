import { Face } from "../math/Face";
import { Cell } from "./Cell";

export interface CellInfo {
    cell: Cell;
    extraOpacity: number;
    extraBorder: { [key in Face]?: string };
}
