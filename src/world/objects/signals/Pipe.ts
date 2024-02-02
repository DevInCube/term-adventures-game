import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Vector2 } from "../../../engine/math/Vector2";
import { Sprite } from "../../../engine/data/Sprite";
import { Object2D } from "../../../engine/objects/Object2D";
import { ISignalProcessor } from "../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../engine/signaling/SignalTransfer";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";
import { Rotations } from "../../../engine/math/Rotation";

export class Pipe extends Object2D implements ISignalProcessor {
    private _sprite: Sprite;
    private _indicatorSprite: Sprite;

    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            inputs: [Rotations.forward, Rotations.back],
            outputs: [Rotations.forward, Rotations.back],
        });
        const sprite = Sprite.parseSimple('═║')
        const indicatorSprite = Sprite.parseSimple('─│');
        super(Vector2.zero, sprite.frames["0"][0], physics, Vector2.from(options.position));

        this._sprite = sprite;
        this._indicatorSprite = indicatorSprite;
        this.type = "pipe";
        this.setAction(ctx => (ctx.obj as Pipe).rotate())
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        const signalCell = this.physics.signalCells[0];
        const outputs = transfers
            .filter(x => signalCell.inputs.includes(Rotations.normalize(x.rotation)))
            .map(x => ({ rotation: Rotations.normalize(x.rotation + Rotations.opposite), signal: x.signal }));
        this.resetSkin(outputs.length > 0);
        return outputs;
    }

    private resetSkin(isHighlighted: boolean = false) {
        const frameName = Rotations.normalize(this.rotation).toString();
        const pipeFrame = this._sprite.frames[frameName][0];
        const indicatorFrame = this._indicatorSprite.frames[frameName][0].color(isHighlighted ? 'white' : 'black');
        this.skin = new CompositeObjectSkin([pipeFrame, indicatorFrame]);
    }
}
