import { ObjectSkin } from "../components/ObjectSkin";
import { Tile } from "../objects/Tile";
import { TileInfo } from "./TileInfo";
import { Grid } from "../math/Grid";
import { Vector2 } from "../math/Vector2";
import { Particle } from "../objects/Particle";

export class Tiles {
    static defaultTile: TileInfo = new TileInfo('#331', '<default_tile>');
    static defaultSize: Vector2 = new Vector2(20, 20);

    static createEmptyMap(size: Vector2, callback: () => TileInfo): Grid<Tile> {
        const grid = new Grid<TileInfo>(size).fill(callback);
        return grid.map(this.createTile);
    }

    static createEmpty(size: Vector2): Grid<Tile> {
        return this.createEmptyMap(size, () => Tiles.defaultTile);
    }

    static createEmptyDefault() {
        return this.createEmpty(this.defaultSize);
    } 

    static parseTiles(str: string, map: { [key: string]: TileInfo }): Grid<Tile> {
        const tileInfos = str
            .split('\n')
            .map(mapLine);
        return Grid.from(tileInfos).map(this.createTile);
    
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

    private static createTile(tileInfo: TileInfo, position: Vector2) {
        const skin = new ObjectSkin().background(tileInfo.color);
        const tile = new Tile(skin, position.clone());
        tile.type = tileInfo.type;
        tile.category = tileInfo.category;
        tile.effects = [...tileInfo.effects];
        tile.disturbanceSprite = tileInfo.disturbanceSprite;
        tile.disturbanceMaxValue = tileInfo.disturbanceSprite?.frames[Particle.defaultFrameName].length || 0;
        tile.physics = tileInfo.objectPhysics || tile.physics;
        return tile;
    }
}