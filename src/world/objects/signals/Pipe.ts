import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Orientation, OrientationHelper, Orientations } from "../../../engine/math/Orientation";
import { Vector2 } from "../../../engine/math/Vector2";
import { SidesHelper } from "../../../engine/math/Sides";
import { Sprite } from "../../../engine/data/Sprite";
import { StaticGameObject } from "../../../engine/objects/StaticGameObject";
import { ISignalProcessor, SignalTransfer } from "../../../engine/components/SignalCell";
import { FaceHelper } from "../../../engine/math/Face";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";

export class Pipe extends StaticGameObject implements ISignalProcessor {
    private _orientation: Orientation;
    private _sprite: Sprite;
    private _indicatorSprite: Sprite;

    constructor(options: { position: [number, number]; orientation?: Orientation }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.horizontal(),
        });
        const sprite = Sprite.parseSimple('═║')
        const indicatorSprite = Sprite.parseSimple('─│');
        super(Vector2.zero, sprite.frames["0"][0], physics, Vector2.from(options.position));

        this._sprite = sprite;
        this._indicatorSprite = indicatorSprite;
        this.type = "pipe";
        this.setAction(ctx => (ctx.obj as Pipe).rotate())

        this.setOrientation(options.orientation || "horizontal");
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        const signalCell = this.physics.signalCells[0];
        const enabledInputs = Object.entries(signalCell.inputSides!).filter(x => x[1]).map(x => x[0]);
        const outputs = transfers
            .filter(x => enabledInputs.includes(x.direction))
            .map(transfer => {
                const outputDirection = FaceHelper.getOpposite(transfer.direction);
                return { direction: outputDirection, signal: transfer.signal };
            });
        this.resetSkin(this._orientation, outputs.length > 0);
        return outputs;
    }

    public rotate() {
        this.setOrientation(OrientationHelper.rotate(this._orientation));
    }
    
    private setOrientation(orientation: Orientation) {
        this._orientation = orientation;
        this.resetSkin(this._orientation);

        const signalCell = this.physics.signalCells[0];
        signalCell.sides = SidesHelper.fromOrientation(this._orientation);
        signalCell.inputSides = SidesHelper.fromOrientation(this._orientation);
    }

    
    private resetSkin(face: Orientation, isHighlighted: boolean = false) {
        const index = Orientations.indexOf(face);
        const indeicatorFrame = this._indicatorSprite.frames[index.toString()][0];
        indeicatorFrame.setForegroundAt([0, 0], isHighlighted ? 'white' : 'black');
        this.skin = new CompositeObjectSkin([this._sprite.frames[index.toString()][0], indeicatorFrame]);
    }
}
