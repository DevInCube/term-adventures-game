import { Color } from "../math/Color";
import { Face } from "../math/Face";
import { Vector2 } from "../math/Vector2";

export type CellDrawOptions = {
    miniCellPosition: Vector2,
    scale: number,
    bold: boolean,
    opacity: number,
    border: { [key in Face]?: string } | undefined;
};

export const defaultCellDrawOptions = {
    miniCellPosition: new Vector2(0, 0),
    scale: 1,
    bold: false,
    opacity: 1,
    border: undefined,
};

export class Cell {
    public options: CellDrawOptions = defaultCellDrawOptions;
    
    get isEmpty() {
        const result = 
            this.character === ' ' && 
            this.textColor === '' && 
            this.backgroundColor === '';
        return result;
    }

    constructor(
        public character: string = ' ', 
        public textColor: string = 'white', 
        public backgroundColor: string = 'black') 
    {
    }
}
