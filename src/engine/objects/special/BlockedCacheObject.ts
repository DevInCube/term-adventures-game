import { Vector2 } from "../../math/Vector2";
import { Grid } from "../../math/Grid";
import { Object2D } from "../Object2D";

const _position = new Vector2();

export class BlockedCacheObject extends Object2D {
    blockedLayer: Grid<Object2D | undefined>;

    constructor(size: Vector2) {
        super();
        this.layer = "ui";
        this.type = "blocked_cache";
        this.blockedLayer = new Grid<Object2D | undefined>(size);
    }

    update(ticks: number) {
        super.update(ticks);
        this.updateBlocked();
    }

    public isPositionBlocked(position: Vector2) {
        return !!this.blockedLayer.at(position);
    }

    public getBlockerAt(position: Vector2): Object2D | undefined {
        return this.blockedLayer.at(position);
    }

    private updateBlocked() {
        this.blockedLayer.fillValue(undefined);
        const objects = this.scene!.children
            .filter(x => x !== this)
            .filter(x => x.enabled);
        for (const object of objects) {
            this.updateBlockedByObject(object);
        }
    }

    private updateBlockedByObject(object: Object2D) {
        if (!object.enabled) {
            return;
        }

        for (const child of object.children) {
            this.updateBlockedByObject(child)
        }

        for (const cellPos of object.physics.collisions) {
            const result = object.getWorldPosition(_position).sub(object.originPoint).add(cellPos);
            if (!this.blockedLayer.containsPosition(result)) {
                continue;
            }

            this.blockedLayer.setAt(result, object);
        }
    }
}
