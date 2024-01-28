import { Vector2 } from "../math/Vector2";
import { Object2D } from "./Object2D";
import { Tile } from "./Tile";

export class TilesObject extends Object2D {
    constructor(public tiles: Tile[][]) {
        super();
        this.type = "tiles";

        for (const tile of tiles.flat()) {
            this.add(tile);
        }
    }

    update(ticks: number): void {
        super.update(ticks);

        for (const tile of this.children) {
            tile.update(ticks);
        }
    }

    public getTileAt(position: Vector2): Tile | undefined {
        return this.tiles[position.y]?.[position.x];
    }
}
