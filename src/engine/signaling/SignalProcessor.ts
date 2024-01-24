import { fillLayerWith } from "../../utils/layer";
import { Level } from "../Level";
import { Scene } from "../Scene";
import { SignalCell } from "../components/SignalCell";
import { Box2 } from "../data/Box2";
import { Face, FaceHelper, Faces } from "../data/Face";
import { Sides } from "../data/Sides";
import { Vector2 } from "../data/Vector2";
import { StaticGameObject } from "../objects/StaticGameObject";

export class SignalProcessor {
    //public signalLayer: (number | undefined)[][] = [];

    public get signalLayer(): (SignalCell | undefined)[][] {
        const layer = fillLayerWith(this.level.size, p => this.getSignalCellAt(p));
        return layer;
    }

    constructor(private level: Level) {
    }

    public update(scene: Scene) {
        // clear
        //const layer: (number | undefined)[][] = []
        //fillLayer(layer, this.level.size, undefined);

        const signalObjects = [...this.level.objects.filter(x => x.enabled)];

        // Clear all cells signals.
        for (const obj of signalObjects) {
            for (const signalCell of obj.physics.signalCells) {
                signalCell.signal = undefined;
            }
        }

        for (const obj of signalObjects) {
            for (const signalCell of obj.physics.signalCells) {
                this.updateSignalCell(signalCell, obj, scene);
            }
        }
    }

    private updateSignalCell(signalCell: SignalCell, obj: StaticGameObject, scene: Scene) {
        const signalCellPosition = obj.position.clone().sub(obj.originPoint).add(signalCell.position);
        if (signalCell.sourceOf) {
            signalCell.signal = signalCell.sourceOf;
        }

        if (signalCell.detectorOf?.life) {
            const npcsAt = [
                scene.getNpcAt(signalCellPosition), 
                ...Faces
                    .map(x => Vector2.fromFace(x))
                    .map(x => signalCellPosition.clone().add(x))
                    .map(x => scene.getNpcAt(x))
            ];

            const lifeLevel = npcsAt.filter(x => x).length > 0 ? 1 : -1;
            signalCell.signal = lifeLevel;
        }

        if (signalCell.detectorOf?.fire) {
            const temperatureAt = scene.getTemperatureAt(signalCellPosition);
            const temperatureLevel = (temperatureAt >= signalCell.detectorOf.fire) ? 1 : -1;
            signalCell.signal = temperatureLevel;
        }

        if (signalCell.detectorOf?.light) {
            const lightLevelAt = scene.getLightAt(signalCellPosition);
            const lightSignalLevel = (lightLevelAt >= signalCell.detectorOf.light) ? 1 : -1;
            signalCell.signal = lightSignalLevel;
        }

        if (signalCell.detectorOf?.weather) {
            const weatherAt = scene.getWeatherAt(signalCellPosition);
            const weatherLevel = (weatherAt && weatherAt !== "normal") ? 1 : -1;
            signalCell.signal = weatherLevel;
        }

        if (signalCell.signal) {
            const visited: Vector2[] = [];
            this.spreadSignal(signalCellPosition, signalCell.signal, visited);
        }

        // TODO: fix inversion.
        if (signalCell.invertorOf) {
            // TODO: change when rotated.
            const controlCellPosition = signalCellPosition.clone().add(new Vector2(0, +1));
            const controlSignalCell = this.getSignalCellAt(controlCellPosition);
            const controlSignal = controlSignalCell?.signal;
            const control = typeof controlSignal === "undefined" || controlSignal <= 0;
            const invert = control ? true : false;
            signalCell.invertorOf = invert;
            //signalCell.sides[this._face] = invert; 
        }
    }

    private spreadSignal(position: Vector2, level: number, visited: Vector2[], faceFrom?: Face) {
        const signalCell = this.getSignalCellAt(position);
        if (signalCell && faceFrom && !getInputSideEnabled(signalCell.inputSides, faceFrom)) {
            return;
        }

        if (visited.find(x => x.equals(position))) {
            return;
        }

        visited.push(position);

        if (!signalCell) {
            return;
        }

        const signals = signalCell.signal;
        let newLevel = typeof signals === "undefined"
            ? level
            : Math.max(signals, level);

        //processor.signalLayer[position.y][position.x] = newLevel;
        signalCell.signal = newLevel;

        // TODO: signal types and inversion logic.
        if (signalCell.invertorOf === true) {
            newLevel = newLevel === 1 ? -1 : 1;
        }
        
        const enabledFaces = Faces
            .filter(x => signalCell.sides[x]);
        for (const face of enabledFaces) {
            const oppositeFace = FaceHelper.getOpposite(face);
            const nextPosition = position.clone().add(Vector2.fromFace(face));
            this.spreadSignal(nextPosition, newLevel, visited, oppositeFace);
        }
        
        function getInputSideEnabled(sides: Sides | undefined, faceFrom: Face): boolean {
            if (!sides) {
                return false;
            }

            return sides[faceFrom] || false;
        }
    }

    private getSignalCellAt(position: Vector2): SignalCell | undefined {
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
                    return signalCell;
                }
            }
        }

        return undefined;
    }
}