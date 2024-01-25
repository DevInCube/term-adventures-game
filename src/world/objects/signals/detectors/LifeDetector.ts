import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { SidesHelper } from "../../../../engine/data/Sides";
import { Vector2 } from "../../../../engine/data/Vector2";
import { ISignalProcessor, SignalTransfer } from "../../../../engine/components/SignalCell";
import { Faces } from "../../../../engine/data/Face";

export class LifeDetector extends StaticGameObject implements ISignalProcessor {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.all(),
            detectorOf: {
                life: 1,
            },
        });
        super(Vector2.zero, new ObjectSkin(`🙑`, `L`, {
            'L': ['black', 'gray'],
        }), physics, Vector2.from(options.position));

        this.type = "life_detector";
    }

    processSignalTransfer(transfers:  SignalTransfer[]): SignalTransfer[] {
        const npcsAt = [
            this.scene!.getNpcAt(this.position), 
            ...Faces
                .map(x => Vector2.fromFace(x))
                .map(x => this.position.clone().add(x))
                .map(x => this.scene!.getNpcAt(x))
        ];

        const lifeLevel = npcsAt.filter(x => x).length > 0 ? 1 : -1;
        this.setEnabled(lifeLevel > 0);
        return Faces.map(x => ({ direction: x, signal: { type: "life", value: lifeLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.setForegroundAt([0, 0], value ? 'lime' : 'black');
    }
}
