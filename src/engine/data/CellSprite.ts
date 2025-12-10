export class CellSprite {
    public static empty: CellSprite = this.fromChar(' ');

    char: string = ' ';

    public equals(other: CellSprite) {
        return other.char === this.char; 
    }

    public static fromChar(char: string) {
        const cellSprite = new CellSprite();
        cellSprite.char = char;
        return cellSprite;
    }
};