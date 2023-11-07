import { Cell } from "../graphics/Cell";

export class Tiles {
    static parseTiles(str: string, colors: { [key: string]: string }): (Cell | null)[][] {
        let common: { [key: string]: Cell } = {};
        return str
            .split('\n')
            .map(mapLine);
    
        function mapLine(line: string) {
            return line
                .split('')
                .map(mapCell);
        }
    
        function mapCell(s: string) {
            return s === ' ' ? null : createCell(s);
        }
    
        function createCell(s: string) {
            return common[s] || (common[s] = new Cell(' ', 'transparent', colors[s]));
        }
    }
}