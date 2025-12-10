import { Cell } from "../../graphics/Cell";
import { ObjectSkin } from "../../components/ObjectSkin";
import { LayerObject } from "./LayerObject";
import { BlockedCacheObject } from "./BlockedCacheObject";
import { Color } from "../../math/Color";
import { Colors } from "../../math/Colors";
import { CellSprite } from "../../data/CellSprite";

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
        return new ObjectSkin(this.blocked.blockedLayer.atDepth(0).map(v => createCell(!!v)));

        function createCell(b: boolean | undefined) {
            return b === true
                ? new Cell(CellSprite.fromChar('⛌'), Color.fromHexString(`#f00a`), Color.fromHexString(`#000a`))
                : new Cell(CellSprite.empty, undefined, Colors.Transparent);
        }
    }
}
