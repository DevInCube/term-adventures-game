import { NormalRotation } from "../math/Rotation";
import { Vector2 } from "../math/Vector2";

export type CellDrawOptions = {
    miniCellPosition?: Vector2,
    scale?: number,
    bold?: boolean,
    opacity?: number,
    border?: { [key in NormalRotation]?: string } | undefined;
};

export const defaultCellDrawOptions = {
    miniCellPosition: new Vector2(0, 0),
    scale: 1,
    bold: false,
    opacity: 1,
    border: undefined,
};

export class Cell {
    public options: CellDrawOptions = {};
    
    get isEmpty() {
        const result = 
            (this.character === ' ' || !this.textColor) && 
            (!this.backgroundColor || this.backgroundColor === 'transparent');
        return result;
    }

    constructor(
        public character: string = ' ', 
        public textColor: string = 'white', 
        public backgroundColor: string = 'black') 
    {
    }
}
