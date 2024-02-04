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
import { Scene } from "../../../engine/Scene";
import { Camera } from "../../../engine/cameras/Camera";
import { CanvasRenderer } from "../../../engine/renderers/CanvasRenderer";
 
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
        this.setHighlight(outputs.length > 0);
        this.setInverting(isInverting);
        return outputs;
    }

    private invertSignal(signal: Signal): Signal {
        const newValue = signal.value === 0 ? 1 : 0;
        return { type: signal.type, value: newValue };
    }

    onBeforeRender(renderer: CanvasRenderer, scene: Scene, camera: Camera): void {
        const frameName = Rotations.normalize(this.rotation).toString();
        const frame = this._sprite.frames[frameName][0];
        const indicatorFrame = this._indicatorSprite.frames[frameName][0];
        const frames = [indicatorFrame, frame, this._lockedFrame];
        this.skin = new CompositeObjectSkin(frames);
    }

    private setHighlight(isHighlighted: boolean) {
        for (const frame of Object.values(this._indicatorSprite.frames)) {
            frame[0].color(isHighlighted ? 'white' : 'black');
        }
    }

    private setInverting(isInverting: boolean) {
        this._lockedFrame.color(isInverting ? 'transparent' : 'white');
    }
}


