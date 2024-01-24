import { groupUnicode } from "../../utils/unicode";
import { Vector2 } from "../data/Vector2";
import { Cell } from "../graphics/Cell";

export class ObjectSkin {
    private characters: string[] = [];
    private grid: string[][] = [];
    private raw_colors: [string | undefined, string | undefined][][] = [];

    public get size(): Vector2 {
        return new Vector2(this.grid[0]?.length || 0, this.grid.length);
    }

    constructor(
        charactersMask: string = '',
        private colorsMask: string = '', 
        private colors: {
            [key: string]: [string | undefined, string | undefined];
        } = {}
    ) {

        this.raw_colors = this.getRawColors();
        this.characters = charactersMask.split('\n');
        this.grid = this.characters.map(groupUnicode);
        // console.log(charactersMask, this.characters);
    }

    public setForegroundAt([x, y]: [number, number], foreground: string): void {
        if (!this.raw_colors[y][x]) {
            this.raw_colors[y][x] = [foreground, undefined];
            return;
        }

        this.raw_colors[y][x][0] = foreground;
    }

    public setBackgroundAt([x, y]: [number, number], background: string): void {
        if (!this.raw_colors[y][x]) {
            this.raw_colors[y][x] = [undefined, background];
            return;
        }

        this.raw_colors[y][x][1] = background;
    }

    public isEmptyCellAt([x, y]: Vector2): boolean {
        if (x < 0 || y < 0 || y >= this.grid.length || x >= this.grid[y].length) {
            return true;
        }

        const emptyChar = ' ';
        const char = this.grid[y]?.[x] || emptyChar;
        const color = this.raw_colors[y]?.[x] || [undefined, undefined];
        return char === emptyChar && !color[0] && !color[1];
    }

    public getCellsAt(position: Vector2): Cell[] {
        const cellColor = this.raw_colors[position.y]?.[position.x] || [undefined, 'transparent'];
        const char = this.grid[position.y]?.[position.x];
        const cell = new Cell(char, cellColor[0], cellColor[1]);
        return [cell];
    }

    private getRawColors() {
        let raw_colors: [string | undefined, string | undefined][][] = [];
        const lines = this.colorsMask.split('\n');
        for (let y = 0; y < lines.length; y++) {
            raw_colors.push([]);
            for (let x = 0; x < lines[y].length; x++) {
                const cellColor = lines[y][x] || ' ';
                const color = this.colors[cellColor];
                raw_colors[y].push(color ? [...color] : ['', '']);
            }
        }
        return raw_colors;
    }
}
