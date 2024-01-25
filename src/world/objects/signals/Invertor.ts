import { StaticGameObject } from "../../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Face, FaceHelper } from "../../../engine/data/Face";
import { Sprite } from "../../../engine/data/Sprite";
import { Vector2 } from "../../../engine/data/Vector2";
import { ISignalProcessor, Signal, SignalTransfer } from "../../../engine/components/SignalCell";
 
export class Invertor extends StaticGameObject implements ISignalProcessor {
    private _face: Face = "right";
    private _sprite: Sprite;

    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            inputSides: {
                left: true,
            },
            sides: {
                right: true,
            },
            invertorOf: true,
        });
        const sprite = Sprite.parseSimple('><^V'); //('▶️◀️🔼🔽')
        super(Vector2.zero, sprite.frames["0"][0], physics, Vector2.from(options.position));

        this._sprite = sprite;
        this.type = "invertor";
        this.setAction(ctx => (ctx.obj as Invertor).rotate());

        this.faceTo("right");
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        const signalCell = this.physics.signalCells[0];
        const outSide = Object.entries(signalCell.sides!).filter(x => x[1]).map(x => x[0])[0] as Face;
        const controlSignalDirection = FaceHelper.getNextClockwise(outSide);
        const controlTransfers = transfers.filter(transfer => transfer.direction === controlSignalDirection);
        const isInverting = controlTransfers.length === 0;

        const enabledInputs = Object.entries(signalCell.inputSides!).filter(x => x[1]).map(x => x[0]);
        const otherTransfers = transfers.filter(transfer => enabledInputs.includes(transfer.direction));
        return otherTransfers.flatMap(transfer => {
            const invertedSignal = isInverting ? this.invertSignal(transfer.signal) : transfer.signal;
            const outputDirection = FaceHelper.getOpposite(transfer.direction);
            return [{ direction: outputDirection, signal: invertedSignal }];
        });
    }

    private invertSignal(signal: Signal): Signal {
        const newValue = signal.value > 0 ? -1 : 1;
        return { type: signal.type, value: newValue };
    }

    public rotate() {
        this.faceTo(FaceHelper.getNextClockwise(this._face));
    }

    private faceTo(face: Face) {
        this._face = face;
        const signalCell = this.physics.signalCells[0];
        signalCell.sides = {};
        signalCell.sides[face] = true;
        signalCell.inputSides = {};
        signalCell.inputSides[FaceHelper.getOpposite(face)] = true;
        if (this._face === "right") {
            this.skin = this._sprite.frames["0"][0];
        } else if (this._face === "left") {
            this.skin = this._sprite.frames["1"][0];
        } else if (this._face === "top") {
            this.skin = this._sprite.frames["2"][0];
        } else if (this._face === "bottom") {
            this.skin = this._sprite.frames["3"][0];
        }
    }
}


