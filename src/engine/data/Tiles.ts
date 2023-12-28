import { ObjectSkin } from "../components/ObjectSkin";
import { Tile } from "../objects/Tile";
import { TileInfo } from "./TileInfo";

export class Tiles {
    static defaultTile: TileInfo = new TileInfo('#331', '<default_tile>');

    static createEmpty(width: number, height: number): Tile[][] {
        const grid = Array.from(Array(width), () => Array.from(Array(height), () => Tiles.defaultTile));
        return this.tileInfoToTiles(grid);
    }

    static createEmptyDefault() {
        return this.createEmpty(20, 20);
    } 

    static parseTiles(str: string, map: { [key: string]: TileInfo }): Tile[][] {
        const tileInfos = str
            .split('\n')
            .map(mapLine);
        return this.tileInfoToTiles(tileInfos);
    
        function mapLine(line: string): TileInfo[] {
            return line
                .split('')
                .map(mapTileInfo);
        }
    
        function mapTileInfo(s: string): TileInfo {
            const tileInfo = s === ' ' ? Tiles.defaultTile : map[s];
            return tileInfo;
        }
    }

    private static tileInfoToTiles(tileInfos: TileInfo[][]): Tile[][] {
        const tilesGrid: Tile[][] = [];
        for (let y = 0; y < tileInfos.length; y++) {
            tilesGrid.push([]);
            for (let x = 0; x < tileInfos[y].length; x++) {
                const tileInfo = tileInfos[y][x];

                const position: [number, number] = [x, y];
                const skin = new ObjectSkin(' ', '.', { '.': ['transparent', tileInfo.color] });
                const tile = new Tile(skin, position);
                tile.type = tileInfo.type;

                tilesGrid[tilesGrid.length - 1].push(tile);
            }
        }
        
        return tilesGrid;
    }
}