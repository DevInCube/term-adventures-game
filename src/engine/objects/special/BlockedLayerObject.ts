import { Vector2 } from "../../math/Vector2";
import { Cell } from "../../graphics/Cell";
import { Object2D } from "../Object2D";
import * as utils from "../../../utils/layer";
import { ObjectSkin } from "../../components/ObjectSkin";

export class BlockedLayerObject extends Object2D {
    private blockedLayer: boolean[][];

    constructor() {
        super();
        this.layer = "ui";
        this.type = "blocked_layer";
    }

    update(ticks: number) {
        super.update(ticks);
        this.updateBlocked();
        this.skin = this.createBlockedSkin();
    }

    public isPositionBlocked(position: Vector2) {
        const layer = this.blockedLayer;
        return layer?.[position.y]?.[position.x] === true;
    }

    private updateBlocked() {
        const scene = this.scene!;
        const blockedLayer = utils.fillLayer(scene.size, false);
        const objects = scene.children.filter(x => x !== this).filter(x => x.enabled);
        for (const object of objects) {
            for (let y = 0; y < object.physics.collisions.length; y++) {
                for (let x = 0; x < object.physics.collisions[y].length; x++) {
                    if ((object.physics.collisions[y][x] || ' ') === ' ') {
                        continue;
                    }

                    const cellPos = new Vector2(x, y);
                    const result = object.position.clone().sub(object.originPoint).add(cellPos);
                    if (!scene.isPositionValid(result)) {
                        continue;
                    }

                    blockedLayer[result.y][result.x] = true;
                }
            }
        }

        this.blockedLayer = blockedLayer;
    }

    private createBlockedSkin(): ObjectSkin {
        return new ObjectSkin(utils.mapLayer(this.blockedLayer, v => createCell(v)));

        function createCell(b: boolean | undefined) {
            return b === true
                ? new Cell('⛌', `#f00`, `#fff`)
                : new Cell(' ', undefined, undefined);
        }
    }
}
