import { Cell } from "./Cell";

export interface CellInfo {
    cell: Cell;
    transparent: boolean;
    border: [(string | null), (string | null), (string | null), (string | null)];
}
