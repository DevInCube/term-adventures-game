import { groupUnicode } from "../../utils/unicode";
import { Vector2 } from "../math/Vector2";
import { Cell } from "../graphics/Cell";
import { ObjectSkin } from "../components/ObjectSkin";
import { Grid } from "../math/Grid";

type RawColor = [string | undefined, string | undefined];
type ColorsMap = { [key: string]: RawColor; };

export class ObjectSkinBuilder {
    static defaultRawColor: RawColor = [undefined, 'transparent'];

    private characters: Grid<string>;
    private colors: Grid<RawColor>;

    public get size(): Vector2 {
        return this.characters.size;
    }

    constructor(
        charactersMask: string = '',
        colorsMask: string = '',
        colorsMap: ColorsMap = {}
    ) {

        this.colors = this.getRawColors(colorsMask, colorsMap);
        this.characters = Grid.from(charactersMask.split('\n').map(groupUnicode));
    }

    public build(): ObjectSkin {
        const cells = new Grid<Cell>(this.size).fill(v => this.getCellsAt(v)[0]);
        return new ObjectSkin(cells);
    }

    private getRawColors(colorsMask: string, colorsMap: ColorsMap): Grid<RawColor> {
        const colorsMaskItems = colorsMask.split('\n').map(line => line.split(''));
        const rawColors = Grid.from(colorsMaskItems).map(colorMaskItemToRawColor);
        return rawColors;

        function colorMaskItemToRawColor(v: string) {
            const cellColor = v || ' ';
            const color = colorsMap[cellColor];
            const newValue = color ? color : ObjectSkinBuilder.defaultRawColor;
            return newValue;
        }
    }

    public getCellsAt(position: Vector2): Cell[] {
        const cellColor = this.colors.at(position) || ObjectSkinBuilder.defaultRawColor;
        const char = this.characters.at(position);
        const cell = new Cell(char, cellColor[0], cellColor[1]);
        return [cell];
    }
}
