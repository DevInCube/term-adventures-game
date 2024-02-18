import { Vector2 } from "../../math/Vector2";
import { Grid } from "../../math/Grid";
import { Object2D } from "../Object2D";

const _position = new Vector2();

export class BlockedCacheObject extends Object2D {
    blockedLayer: Grid<boolean>;

    constructor(size: Vector2) {
        super();
        this.layer = "ui";
        this.type = "blocked_cache";
        this.blockedLayer = new Grid<boolean>(size);
    }

    update(ticks: number) {
        super.update(ticks);
        this.updateBlocked();
    }

    public isPositionBlocked(position: Vector2) {
        return this.blockedLayer.at(position) === true;
    }

    private updateBlocked() {
        this.blockedLayer.fillValue(false);
        const objects = this.scene!.children
            .filter(x => x !== this)
            .filter(x => x.enabled);
        for (const object of objects) {
            for (const cellPos of object.physics.collisions) {
                const result = object.getWorldPosition(_position).sub(object.originPoint).add(cellPos);
                if (!this.blockedLayer.containsPosition(result)) {
                    continue;
                }

                this.blockedLayer.setAt(result, true);
            }
        }
    }
}
