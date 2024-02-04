import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Vector2 } from "../../../engine/math/Vector2";
import { Sprite } from "../../../engine/data/Sprite";
import { Object2D } from "../../../engine/objects/Object2D";
import { ISignalProcessor } from "../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../engine/signaling/SignalTransfer";
import { Pipe } from "./Pipe";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";
import { Rotations } from "../../../engine/math/Rotation";
import { Scene } from "../../../engine/Scene";
import { Camera } from "../../../engine/cameras/Camera";
import { CanvasRenderer } from "../../../engine/renderers/CanvasRenderer";

export class PipeT extends Object2D implements ISignalProcessor {
    private _sprite: Sprite;
    private _indicatorSprite: Sprite;

    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            inputs: [Rotations.forward, Rotations.left, Rotations.right],
            outputs: [Rotations.forward, Rotations.left, Rotations.right],
        });
        const sprite = Sprite.parseSimple('╠╦╣╩');
        const indicatorSprite = Sprite.parseSimple('├┬┤┴');
        super(Vector2.zero, sprite.frames["0"][0], physics, Vector2.from(options.position));

        this._sprite = sprite;
        this._indicatorSprite = indicatorSprite;
        this.type = "pipe_t";
        this.setAction(ctx => (ctx.obj as Pipe).rotate());
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        const signalCell = this.physics.signalCells[0];
        const outputs = transfers
            .filter(x => signalCell.inputs.includes(Rotations.normalize(x.rotation)))
            .flatMap(transfer => {
                return Rotations.all
                    .filter(x => !Rotations.equals(x, Rotations.back))
                    .map(x => Rotations.normalize(transfer.rotation + x + Rotations.opposite))
                    .map(outputDirection => ({ rotation: outputDirection, signal: transfer.signal }));
            })
            .filter(x => signalCell.outputs.includes(x.rotation));
        this.setHighlight(outputs.length > 0);
        return outputs;
    }

    onBeforeRender(renderer: CanvasRenderer, scene: Scene, camera: Camera): void {
        const frameName = Rotations.normalize(this.rotation).toString();
        const pipeFrame = this._sprite.frames[frameName][0];
        const indicatorFrame = this._indicatorSprite.frames[frameName][0];
        this.skin = new CompositeObjectSkin([pipeFrame, indicatorFrame]);
    }

    private setHighlight(isHighlighted: boolean) {
        for (const frame of Object.values(this._indicatorSprite.frames)) {
            frame[0].color(isHighlighted ? 'white' : 'black');
        }
    }
}
