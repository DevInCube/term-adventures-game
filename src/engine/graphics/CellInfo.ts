import { Cell } from "./Cell";

export interface CellInfo {
    cell: Cell;
    transparent: number;
    border: [(string | null), (string | null), (string | null), (string | null)];
}
