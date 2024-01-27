import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Vector2 } from "../../../engine/math/Vector2";
import { SidesHelper } from "../../../engine/math/Sides";
import { Sprite } from "../../../engine/data/Sprite";
import { Object2D } from "../../../engine/objects/Object2D";
import { ISignalProcessor, SignalTransfer } from "../../../engine/components/SignalCell";
import { Faces } from "../../../engine/math/Face";
import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";

export class PipeX extends Object2D implements ISignalProcessor {
    private _indicatorSkin: ObjectSkin;

    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.horizontal(),
        });
        const innerSprite = Sprite.parseSimple('┼');
        const indicatorSkin = innerSprite.frames["0"][0];
        
        const sprite = Sprite.parseSimple('╬');
        const pipeSkin = sprite.frames["0"][0];
        super(Vector2.zero, new CompositeObjectSkin([pipeSkin, indicatorSkin]), physics, Vector2.from(options.position));

        this.type = "pipe_x";
        this._indicatorSkin = indicatorSkin;
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        const outputs = transfers
            .flatMap(transfer => {
                const oppositeDirection = (transfer.direction);
                return Faces.filter(x => x !== oppositeDirection).map(outputDirection => {
                    return { direction: outputDirection, signal: transfer.signal };
                });
            });
        this._indicatorSkin.setForegroundAt([0, 0], outputs.length > 0 ? 'white': 'black');
        return outputs;
    }
}
