import { Level } from "../Level";
import { isAnISignalProcessor } from "./ISignalProcessor";
import { SignalType } from "./SignalType";
import { SignalTransfer } from "./SignalTransfer";
import { Grid } from "../math/Grid";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";
import { Rotations } from "../math/Rotation";

type SignalMap = { [key in SignalType]: number | undefined };

const _position = new Vector2();

export class SignalProcessor {
    public signalLayer: Grid<SignalMap | undefined>;

    private _prevSignalTransfers: Map<string, SignalTransfer[]> = new Map<string, SignalTransfer[]>();
    private _signalTransfers: Map<string, SignalTransfer[]> = new Map<string, SignalTransfer[]>();

    constructor(private scene: Level) {
        this.signalLayer = new Grid<SignalMap | undefined>(scene.size);
    }

    public update() {
        // clear
        this.clearLayer();
        this._prevSignalTransfers = this._signalTransfers;
        this._signalTransfers = new Map<string, SignalTransfer[]>();

        this.scene.traverse(x => this.updateSignalObject(x));
    }

    private updateSignalObject(object: Object2D) {
        if (!isAnISignalProcessor(object)) {
            return;
        }

        // TODO: this works for 1 cell objects only.
        const key = SignalProcessor.getPositionKey(object.getWorldPosition(_position));

        const inputTransfers = (this._prevSignalTransfers.get(key) || [])
            .map(input => {
                const inputCellRotation = input.rotation;

                // Convert global to local rotations.
                const relativeObjectRotation = Rotations.normalize(inputCellRotation - object.globalRotation);
                return { rotation: relativeObjectRotation, signal: input.signal };
            });
        const outputTransfers = object.processSignalTransfer(inputTransfers);
        this.registerOutputsAt(object.getWorldPosition(_position), outputTransfers);

        const inputs = outputTransfers
            .map(output => {
                const relativeObjectRotation = output.rotation;

                // Convert local to global rotations.
                const outputCellRotation = Rotations.normalize(object.globalRotation + relativeObjectRotation);
                const globalDirection = Vector2.right.rotate(outputCellRotation);
                const inputPosition = object.getWorldPosition(new Vector2()).add(globalDirection);
                const inputCellRotation = Rotations.normalize(outputCellRotation + Rotations.opposite);
                return { position: inputPosition, rotation: inputCellRotation, signal: output.signal };
            });
        for (const input of inputs) {
            const key = SignalProcessor.getPositionKey(input.position);
            this._signalTransfers.set(key, (this._signalTransfers.get(key) || []).concat([input]));
        }
    }

    private clearLayer() {
        this.signalLayer.fillValue(undefined);
    }

    private registerOutputsAt(outputPosition: Vector2, outputs: SignalTransfer[]) {
        if (outputs.length === 0) {
            return;
        }

        const cellSignalsMap = new Map<SignalType, number>();
        for (const output of outputs) {
            const value = cellSignalsMap.get(output.signal.type) || 0;
            cellSignalsMap.set(output.signal.type, Math.max(value, output.signal.value)); 
        }

        const newValue = Object.fromEntries(cellSignalsMap) as SignalMap;
        this.signalLayer.setAt(outputPosition, newValue);
    }

    private static getPositionKey(position: Vector2): string {
        return `${position.x}:${position.y}`;
    }
}