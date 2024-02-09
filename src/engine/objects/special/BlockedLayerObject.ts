import { Vector2 } from "../../math/Vector2";
import { Cell } from "../../graphics/Cell";
import { Object2D } from "../Object2D";
import { ObjectSkin } from "../../components/ObjectSkin";
import { Grid } from "../../math/Grid";

const _position = new Vector2();

export class BlockedLayerObject extends Object2D {
    private blockedLayer: Grid<boolean>;

    constructor(size: Vector2) {
        super();
        this.layer = "ui";
        this.type = "blocked_layer";
        this.blockedLayer = new Grid<boolean>(size);
    }

    update(ticks: number) {
        super.update(ticks);
        this.updateBlocked();
        this.skin = this.createBlockedSkin();
    }

    public isPositionBlocked(position: Vector2) {
        const layer = this.blockedLayer;
        return layer.at(position) === true;
    }

    private updateBlocked() {
        const scene = this.scene!;
        this.blockedLayer.fillValue(false);
        const objects = scene.children.filter(x => x !== this).filter(x => x.enabled);
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

    private createBlockedSkin(): ObjectSkin {
        return new ObjectSkin(this.blockedLayer.map(v => createCell(v)));

        function createCell(b: boolean | undefined) {
            return b === true
                ? new Cell('⛌', `#f00a`, `#000a`)
                : new Cell(' ', undefined, 'transparent');
        }
    }
}
