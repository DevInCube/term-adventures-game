import { ObjectSkin } from "../components/ObjectSkin";
import { Tile } from "../objects/Tile";
import { TileInfo } from "./TileInfo";
import { Grid } from "../math/Grid";
import { Vector2 } from "../math/Vector2";
import { SpriteAnimation } from "../objects/SpriteAnimation";
import { Color } from "../math/Color";

export class Tiles {
    static defaultTile: TileInfo = new TileInfo(Color.fromHexString('#242'), '<default_tile>');
    static defaultSize: Vector2 = new Vector2(20, 20);

    static createEmptyMap(size: Vector2, callback: () => TileInfo): Grid<Tile> {
        const grid = new Grid<TileInfo>(size).fill(callback);
        return grid.map(this.createTile);
    }

    static createEmpty(size: Vector2): Grid<Tile> {
        return this.createEmptyMap(size, () => Tiles.defaultTile);
    }

    static createEmptyRandomized(size: Vector2): Grid<Tile> {
        return this.createEmptyMap(size, () => {
            const alpha = 0.9 + Math.random() * 0.1;
            const tileInfo = new TileInfo(Color.fromHexString('#242').setAlpha(alpha), '<default_tile>');
            return tileInfo;
        });
    }

    static createEmptyDefault() {
        return this.createEmpty(this.defaultSize);
    } 

    static parseTiles(str: string, tilesMap: { [key: string]: TileInfo }): Grid<Tile> {
        if (!tilesMap[' ']) {
            tilesMap[' '] = Tiles.defaultTile;
        }

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
            const tileInfo = tilesMap[s];
            return tileInfo;
        }
    }

    private static createTile(tileInfo: TileInfo, position: Vector2) {
        const skin = new ObjectSkin().background(tileInfo.color);
        const tile = new Tile(skin, position.clone());
        tile.type = tileInfo.type;
        tile.category = tileInfo.category;
        tile.effects = [...tileInfo.effects];
        tile.disturbanceAnimation = tileInfo.disturbanceSprite
            ? new SpriteAnimation(tileInfo.disturbanceSprite)
            : undefined;
        tile.physics = tileInfo.objectPhysics || tile.physics;
        return tile;
    }
}