import { CellSprite } from "../data/CellSprite";
import { Color } from "../math/Color";
import { Colors } from "../math/Colors";
import { NormalRotation } from "../math/Rotation";
import { Vector2 } from "../math/Vector2";

export type CellDrawOptions = {
    miniCellPosition?: Vector2,
    scale?: number,
    bold?: boolean,
    opacity?: number,
    border?: { [key in NormalRotation]?: Color } | undefined;
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
            (this.character.equals(CellSprite.empty) || !this.textColor) && 
            (!this.backgroundColor || this.backgroundColor.equals(Colors.Transparent)) && 
            !this.options.border;
        return result;
    }

    constructor(
        public character: CellSprite = CellSprite.empty, 
        public textColor: Color = Colors.White, 
        public backgroundColor: Color = Colors.Transparent) 
    {
    }
}
