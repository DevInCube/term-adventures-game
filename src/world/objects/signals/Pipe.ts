import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Orientation, OrientationHelper } from "../../../engine/data/Orientation";
import { Vector2 } from "../../../engine/data/Vector2";
import { SidesHelper } from "../../../engine/data/Sides";
import { Sprite } from "../../../engine/data/Sprite";
import { StaticGameObject } from "../../../engine/objects/StaticGameObject";
import { ISignalProcessor, SignalTransfer } from "../../../engine/components/SignalCell";
import { FaceHelper } from "../../../engine/data/Face";

export class Pipe extends StaticGameObject implements ISignalProcessor {
    private _orientation: Orientation;
    private _sprite: Sprite;

    constructor(options: { position: [number, number]; orientation?: Orientation }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.horizontal(),
        });
        const sprite = Sprite.parseSimple('═‖')
        super(Vector2.zero, sprite.frames["0"][0], physics, Vector2.from(options.position));

        this._sprite = sprite;
        this.type = "pipe";
        this.setAction(ctx => (ctx.obj as Pipe).rotate())

        this.setOrientation(options.orientation || "horizontal");
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        const signalCell = this.physics.signalCells[0];
        const enabledInputs = Object.entries(signalCell.inputSides!).filter(x => x[1]).map(x => x[0]);
        return transfers
            .filter(x => enabledInputs.includes(x.direction))
            .map(transfer => {
                const outputDirection = FaceHelper.getOpposite(transfer.direction);
                return { direction: outputDirection, signal: transfer.signal };
            });
    }

    public rotate() {
        this.setOrientation(OrientationHelper.rotate(this._orientation));
    }
    
    private setOrientation(orientation: Orientation) {
        this._orientation = orientation;
        if (this._orientation === "horizontal") {
            this.skin = this._sprite.frames["0"][0];
        } else {
            this.skin = this._sprite.frames["1"][0];
        }

        const signalCell = this.physics.signalCells[0];
        signalCell.sides = SidesHelper.fromOrientation(this._orientation);
        signalCell.inputSides = SidesHelper.fromOrientation(this._orientation);
    }
}
