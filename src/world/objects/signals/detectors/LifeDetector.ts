import { Object2D } from "../../../../engine/objects/Object2D";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { SidesHelper } from "../../../../engine/math/Sides";
import { Vector2 } from "../../../../engine/math/Vector2";
import { ISignalProcessor } from "../../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../../engine/signaling/SignalTransfer";
import { Faces } from "../../../../engine/math/Face";

export class LifeDetector extends Object2D implements ISignalProcessor {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            sides: SidesHelper.all(),
        });
        super(Vector2.zero, new ObjectSkin().char(`🙑`).color('black').background('gray'), physics, Vector2.from(options.position));

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

        const lifeLevel = npcsAt.filter(x => x).length > 0 ? 1 : 0;
        this.setEnabled(lifeLevel > 0);
        return Faces.map(x => ({ direction: x, signal: { type: "life", value: lifeLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.color(value ? 'lime' : 'black');
    }
}
