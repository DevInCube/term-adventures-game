import { Grid } from "../../math/Grid";
import { Vector2 } from "../../math/Vector2";
import { Object2D } from "../Object2D";
import { Tile } from "../Tile";

export class TilesObject extends Object2D {
    constructor(public tiles: Grid<Tile>) {
        super();
        this.type = "tiles";

        for (const tile of tiles) {
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
        return this.tiles.at(position);
    }
}
