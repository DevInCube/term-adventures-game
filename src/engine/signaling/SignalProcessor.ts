import { fillLayer } from "../../utils/layer";
import { Level } from "../Level";
import { Scene } from "../Scene";
import { Signal, SignalCell, SignalTransfer, SignalType, isAnISignalInit, isAnISignalProcessor, isAnISignalSource } from "../components/SignalCell";
import { Box2 } from "../data/Box2";
import { Face, FaceHelper } from "../data/Face";
import { Vector2 } from "../data/Vector2";
import { StaticGameObject } from "../objects/StaticGameObject";

type Visitor = {
    position: Vector2;
    direction: Face;
    signalType: SignalType;
}

function visitorEquals(v1: Visitor, v2: Visitor) {
    return (
        v1.position.equals(v2.position) &&
        v1.direction === v2.direction &&
        v1.signalType === v2.signalType
    );
}

export class SignalProcessor {
    public signalLayer: (number | undefined)[][] = [];

    constructor(private level: Level) {
    }

    public update(scene: Scene) {
        // clear
        this.clearLayer();

        const signalObjects = [...this.level.objects.filter(x => x.enabled)];

        // Clear all cells signals.
        for (const obj of signalObjects) {
            if (isAnISignalInit(obj)) {
                obj.initialize();
            }
        }

        for (const obj of signalObjects) {
            //TODO: only 1 cell object will work here.
            this.updateSignalSource(obj, scene);
        }
    }

    private updateSignalSource(object: StaticGameObject, scene: Scene) {
        if (!isAnISignalSource(object)) {
            return;
        }

        const outputs = object.updateSource(scene);
        this.registerOutputsAt(object.position, outputs);
        const visited: Visitor[] = [];
        for (const output of outputs) {
            //TODO: only 1 cell object will work here.
            const outputPosition = object.position.clone().add(Vector2.fromFace(output.direction))
            const inputDirection = FaceHelper.getOpposite(output.direction);
            this.processSignalAt(outputPosition, inputDirection, output.signal, visited);
        }
    }
    
    private processSignalAt(position: Vector2, direction: Face, signal: Signal, visited: Visitor[]) {
        const visitor = { position, direction, signalType: signal.type } as Visitor;
        if (visited.find(x => visitorEquals(x, visitor))) {
            return;
        }

        visited.push(visitor);

        const result = this.getSignalCellAt(position);
        if (!result) {
            return;
        }

        const { cell: signalCell, object } = result;
        if (!isAnISignalProcessor(object)) {
            return;
        }

        const input = { signal, direction };
        const outputs = object.processSignalTransfer(input);
        this.registerOutputsAt(object.position, outputs);
        for (const output of outputs) {
            const outputPosition = position.clone().add(Vector2.fromFace(output.direction));
            const inputDirection = FaceHelper.getOpposite(output.direction);
            this.processSignalAt(outputPosition, inputDirection, output.signal, visited);
        }
    }

    private clearLayer() {
        this.signalLayer = fillLayer(this.level.size, undefined);
    }

    private registerOutputsAt(pos: Vector2, outputs: SignalTransfer[]) {
        if (outputs.length === 0) {
            return;
        }

        this.signalLayer[pos.y][pos.x] = Math.max(...outputs.map(x => x.signal.value));
    }

    private getSignalCellAt(position: Vector2): { cell: SignalCell, object: StaticGameObject} | undefined {
        const levelBox = new Box2(new Vector2(), this.level.size.clone().sub(new Vector2(1, 1)));
        if (!levelBox.containsPoint(position)) {
            return undefined;
        }

        for (const obj of this.level.objects) {
            if (!obj.enabled) continue;

            const objOriginPos = obj.position.clone().sub(obj.originPoint);
            for (const signalCell of obj.physics.signalCells) {
                const signalCellPos = objOriginPos.clone().add(signalCell.position);
                if (signalCellPos.equals(position)) {
                    return { cell: signalCell, object: obj };
                }
            }
        }

        return undefined;
    }
}