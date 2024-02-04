import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Vector2 } from "../../../engine/math/Vector2";
import { Sprite } from "../../../engine/data/Sprite";
import { Object2D } from "../../../engine/objects/Object2D";
import { ISignalProcessor } from "../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../engine/signaling/SignalTransfer";
import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";
import { Rotations } from "../../../engine/math/Rotation";

export class PipeX extends Object2D implements ISignalProcessor {
    private _indicatorSkin: ObjectSkin;

    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            inputs: Rotations.all,
            outputs: Rotations.all,
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
                return Rotations.all
                    .filter(x => !Rotations.equals(x, Rotations.back))
                    .map(x => Rotations.normalize(transfer.rotation + x + Rotations.opposite))
                    .map(x => ({ rotation: x, signal: transfer.signal }));
            });
        this.setHighlight(outputs.length > 0);
        return outputs;
    }

    private setHighlight(isHighlighted: boolean) {
        this._indicatorSkin.color(isHighlighted ? 'white': 'black');
    }
}
