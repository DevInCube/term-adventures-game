import { TileCategory } from "../objects/TileCategory";

export class TileInfo {
    constructor(
        public color: string = 'transparent',
        public type: string = 'undefined_tile',
        public category: TileCategory = "solid",
        public movementPenalty: number = 1) {
    }
}
