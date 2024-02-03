import { Object2D } from "../../../engine/objects/Object2D";
import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Sprite } from "../../../engine/data/Sprite";
import { Vector2 } from "../../../engine/math/Vector2";
import { ISignalProcessor } from "../../../engine/signaling/ISignalProcessor";
import { Signal } from "../../../engine/signaling/Signal";
import { SignalTransfer } from "../../../engine/signaling/SignalTransfer";
import { Rotations } from "../../../engine/math/Rotation";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";
import { ObjectSkin } from "../../../engine/components/ObjectSkin";
 
export class Invertor extends Object2D implements ISignalProcessor {
    private _sprite: Sprite;
    private _indicatorSprite: Sprite;
    private _lockedFrame: ObjectSkin;

    constructor(options?: { position: [number, number]; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            inputs: [Rotations.back],
            outputs: [Rotations.forward],
        });
        const sprite = Sprite.parseSimple('▷▽◁△');
        const skin = sprite.frames["0"][0];
        const indicatorSprite = Sprite.parseSimple('▶▼◀▲'); //('▶️🔽◀️🔼')
        const indicatorSkin = indicatorSprite.frames["0"][0];
        const lockedFrame = Sprite.parseSimple('◯').frames["0"][0].color('white');
        super(Vector2.zero, new CompositeObjectSkin([indicatorSkin, skin]), physics, Vector2.from(options?.position || [0, 0]));

        this._sprite = sprite;
        this._indicatorSprite = indicatorSprite;
        this._lockedFrame = lockedFrame;
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
        this.resetSkin(outputs.length > 0, isInverting);
        return outputs;
    }

    private invertSignal(signal: Signal): Signal {
        const newValue = signal.value === 0 ? 1 : 0;
        return { type: signal.type, value: newValue };
    }

    private resetSkin(isHighlighted: boolean = false, isInverting: boolean = true) {
        const frameName = Rotations.normalize(this.rotation).toString();
        const frame = this._sprite.frames[frameName][0];
        const indicatorFrame = this._indicatorSprite.frames[frameName][0].color(isHighlighted ? 'white' : 'black');
        const frames = [indicatorFrame, frame];
        if (!isInverting) {
            frames.push(this._lockedFrame);
        }

        this.skin = new CompositeObjectSkin(frames);
    }
}


