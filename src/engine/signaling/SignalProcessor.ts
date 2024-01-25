import { fillLayer } from "../../utils/layer";
import { Level } from "../Level";
import { Scene } from "../Scene";
import { SignalTransfer, isAnISignalProcessor } from "../components/SignalCell";
import { FaceHelper } from "../data/Face";
import { Vector2 } from "../data/Vector2";
import { SceneObject } from "../objects/SceneObject";

export class SignalProcessor {
    public signalLayer: (number | undefined)[][] = [];

    private _prevSignalTransfers: Map<string, SignalTransfer[]> = new Map<string, SignalTransfer[]>();
    private _signalTransfers: Map<string, SignalTransfer[]> = new Map<string, SignalTransfer[]>();

    constructor(private level: Level) {
    }

    public update(scene: Scene) {
        // clear
        this.clearLayer();
        this._prevSignalTransfers = this._signalTransfers;
        this._signalTransfers = new Map<string, SignalTransfer[]>();

        const signalObjects = [...this.level.objects.filter(x => x.enabled)];
        for (const object of signalObjects) {
            this.updateSignalObject(object);
        }
    }

    private updateSignalObject(object: SceneObject) {
        if (!isAnISignalProcessor(object)) {
            return;
        }

        // TODO: this works for 1 cell objects only.
        const key = SignalProcessor.getPositionKey(object.position);
        const inputTransfers = this._prevSignalTransfers.get(key) || [];
        const outputTransfers = object.processSignalTransfer(inputTransfers);
        this.registerOutputsAt(object.position, outputTransfers);
        const inputs = outputTransfers.map(output => {
            const inputPosition = object.position.clone().add(Vector2.fromFace(output.direction));
            const inputDirection = FaceHelper.getOpposite(output.direction);
            return { position: inputPosition, direction: inputDirection, signal: output.signal };
        });
        for (const input of inputs) {
            const key = SignalProcessor.getPositionKey(input.position);
            const inputTransfer = { direction: input.direction, signal: input.signal };
            this._signalTransfers.set(key, (this._signalTransfers.get(key) || []).concat([inputTransfer]));
        }
    }

    private clearLayer() {
        this.signalLayer = fillLayer(this.level.size, undefined);
    }

    private registerOutputsAt(outputPosition: Vector2, outputs: SignalTransfer[]) {
        if (outputs.length === 0) {
            return;
        }

        this.signalLayer[outputPosition.y][outputPosition.x] = Math.max(...outputs.map(x => x.signal.value));
    }

    private static getPositionKey(position: Vector2): string {
        return `${position.x}:${position.y}`;
    }
}