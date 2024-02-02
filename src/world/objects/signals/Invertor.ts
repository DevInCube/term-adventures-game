import { Object2D } from "../../../engine/objects/Object2D";
import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Sprite } from "../../../engine/data/Sprite";
import { Vector2 } from "../../../engine/math/Vector2";
import { ISignalProcessor } from "../../../engine/signaling/ISignalProcessor";
import { Signal } from "../../../engine/signaling/Signal";
import { SignalTransfer } from "../../../engine/signaling/SignalTransfer";
import { Rotations } from "../../../engine/math/Rotation";
 
export class Invertor extends Object2D implements ISignalProcessor {
    private _sprite: Sprite;

    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            inputs: [Rotations.back],
            outputs: [Rotations.forward],
        });
        const sprite = Sprite.parseSimple('>V<^'); //('▶️🔽◀️🔼')
        const defaultSkin = sprite.frames["0"][0];
        super(Vector2.zero, defaultSkin, physics, Vector2.from(options.position));

        this._sprite = sprite;
        this.type = "invertor";
        this.setAction(ctx => (ctx.obj as Invertor).rotate());
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        const controlTransfers = transfers
            .filter(x => Rotations.equals(x.rotation, Rotations.right));
        const isInverting = controlTransfers.length === 0;

        const outputs = transfers
            .filter(x => Rotations.equals(x.rotation, Rotations.back))
            .map(transfer => {
                const invertedSignal = isInverting ? this.invertSignal(transfer.signal) : transfer.signal;
                const outputDirection = Rotations.normalize(transfer.rotation + Rotations.opposite);
                return { rotation: outputDirection, signal: invertedSignal };
            });
        this.resetSkin(outputs.length > 0);
        return outputs;
    }

    private invertSignal(signal: Signal): Signal {
        const newValue = signal.value === 0 ? 1 : 0;
        return { type: signal.type, value: newValue };
    }

    private resetSkin(isHighlighted: boolean = false) {
        const frameIndex = Rotations.normalize(this.rotation).toString();
        this.skin = this._sprite.frames[frameIndex][0];
    }
}


