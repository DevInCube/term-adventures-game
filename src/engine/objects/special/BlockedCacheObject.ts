import { Vector2 } from "../../math/Vector2";
import { Grid } from "../../math/Grid";
import { Object2D } from "../Object2D";
import { Grid3 } from "../../math/Grid3";
import { Vector3 } from "../../math/Vector3";

const _position = new Vector2();

export class BlockedCacheObject extends Object2D {
    blockedLayer: Grid3<Object2D | undefined>;

    constructor(size: Vector3) {
        super();
        this.layer = "ui";
        this.type = "blocked_cache";
        this.blockedLayer = new Grid3<Object2D | undefined>(size);
    }

    update(ticks: number) {
        super.update(ticks);
        this.updateBlocked();
    }

    public isPositionBlocked(position: Vector3) {
        return !!this.blockedLayer.at(position);
    }

    public getBlockerAt(position: Vector3): Object2D | undefined {
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
            const position2 = object.getWorldPosition(_position).sub(object.originPoint).add(cellPos);
            const position3 = new Vector3(position2.x, position2.y, 0);
            if (!this.blockedLayer.containsPosition(position3)) {
                continue;
            }

            this.blockedLayer.setAt(position3, object);
        }
    }
}
