import { Object2D } from "../../../../engine/objects/Object2D";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Vector2 } from "../../../../engine/math/Vector2";
import { ISignalProcessor } from "../../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../../engine/signaling/SignalTransfer";
import { Rotations } from "../../../../engine/math/Rotation";
import { Colors } from "../../../../engine/math/Colors";

const _position = new Vector2();

export class LifeDetector extends Object2D implements ISignalProcessor {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            inputs: Rotations.none,
            outputs: Rotations.all,
        });
        const skin = new ObjectSkin().char(`🙑`).color(Colors.Black).background(Colors.Gray);
        super(Vector2.zero, skin, physics, Vector2.from(options.position));

        this.type = "life_detector";
    }

    processSignalTransfer(transfers:  SignalTransfer[]): SignalTransfer[] {
        const npcsAt = [
            this.scene!.getNpcAt(this.getWorldPosition(_position)), 
            ...Vector2.directions
                .map(x => this.getWorldPosition(_position).add(x))
                .map(x => this.scene!.getNpcAt(x))
        ];

        const lifeLevel = npcsAt.filter(x => x).length > 0 ? 1 : 0;
        this.setEnabled(lifeLevel > 0);
        return Rotations.all.map(x => ({ rotation: x, signal: { type: "life", value: lifeLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.color(value ? Colors.Lime : Colors.Black);
    }
}
