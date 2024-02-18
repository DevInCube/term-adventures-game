import { Cell } from "../../graphics/Cell";
import { ObjectSkin } from "../../components/ObjectSkin";
import { LayerObject } from "./LayerObject";
import { BlockedCacheObject } from "./BlockedCacheObject";

export class BlockedLayerObject extends LayerObject {
    constructor(private blocked: BlockedCacheObject) {
        super();
        this.layer = "ui";
        this.type = "blocked_layer";
    }

    update(ticks: number) {
        super.update(ticks);
        this.skin = this.createBlockedSkin();
    }

    private createBlockedSkin(): ObjectSkin {
        return new ObjectSkin(this.blocked.blockedLayer.map(v => createCell(v)));

        function createCell(b: boolean | undefined) {
            return b === true
                ? new Cell('⛌', `#f00a`, `#000a`)
                : new Cell(' ', undefined, 'transparent');
        }
    }
}
