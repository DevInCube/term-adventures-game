import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Vector2 } from "../../../engine/math/Vector2";
import { SidesHelper } from "../../../engine/math/Sides";
import { Sprite } from "../../../engine/data/Sprite";
import { Object2D } from "../../../engine/objects/Object2D";
import { ISignalProcessor, SignalTransfer } from "../../../engine/components/SignalCell";
import { Face, FaceHelper, Faces } from "../../../engine/math/Face";
import { Pipe } from "./Pipe";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";

export class PipeT extends Object2D implements ISignalProcessor {
    private _face: Face;
    private _sprite: Sprite;
    private _indicatorSprite: Sprite;

    constructor(options: { position: [number, number]; face?: Face; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.horizontal(),
        });
        const sprite = Sprite.parseSimple('╩╠╦╣');
        const indicatorSprite = Sprite.parseSimple('┴├┬┤');
        super(Vector2.zero, sprite.frames["0"][0], physics, Vector2.from(options.position));

        this._sprite = sprite;
        this._indicatorSprite = indicatorSprite;
        this.type = "pipe_t";
        this.setAction(ctx => (ctx.obj as Pipe).rotate());

        this.setFace(options.face || "bottom");
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        const signalCell = this.physics.signalCells[0];
        const enabledInputs = Object.entries(signalCell.inputSides!).filter(x => x[1]).map(x => x[0]);
        const enabledOutputs = Object.entries(signalCell.sides!).filter(x => x[1]).map(x => x[0] as Face);
        const outputs = transfers
            .filter(x => enabledInputs.includes(x.direction))
            .flatMap(transfer => {
                const oppositeDirection = (transfer.direction);
                return Faces.filter(x => enabledOutputs.includes(x) && x !== oppositeDirection).map(outputDirection => {
                    return { direction: outputDirection, signal: transfer.signal };
                });
            });
        this.resetSkin(this._face, outputs.length > 0);
        return outputs;
    }

    public rotate() {
        this.setFace(FaceHelper.getNextClockwise(this._face));
    }

    private setFace(face: Face) {
        this._face = face;
        this.resetSkin(this._face);

        const signalCell = this.physics.signalCells[0];
        signalCell.sides = Object.fromEntries(Faces.filter(x => x !== FaceHelper.getOpposite(this._face)).map(x => ([x, true])));
        signalCell.inputSides = Object.fromEntries(Faces.filter(x => x !== this._face).map(x => ([x, true])));
    }

    private resetSkin(face: Face, isHighlighted: boolean = false) {
        const index = Faces.indexOf(face);
        const indeicatorFrame = this._indicatorSprite.frames[index.toString()][0];
        indeicatorFrame.setForegroundAt([0, 0], isHighlighted ? 'white' : 'black');
        this.skin = new CompositeObjectSkin([this._sprite.frames[index.toString()][0], indeicatorFrame]);
    }
}
