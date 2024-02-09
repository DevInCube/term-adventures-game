import { Object2D } from "../../../../engine/objects/Object2D";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Vector2 } from "../../../../engine/math/Vector2";
import { ISignalProcessor } from "../../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../../engine/signaling/SignalTransfer";
import { Rotations } from "../../../../engine/math/Rotation";

const _position = new Vector2();

export class LightDetector extends Object2D implements ISignalProcessor {
    constructor(options: { position: [number, number]; }) {
        const skin = new ObjectSkin().char(`☀`).color('black').background('gray');
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            inputs: Rotations.none,
            outputs: Rotations.all,
        });
        super(Vector2.zero, skin, physics, Vector2.from(options.position));

        this.type = "light_detector";
    }

    processSignalTransfer(transfers:  SignalTransfer[]): SignalTransfer[] {
        const lightInfoAt = this.scene!.lights.getLightInfoAt(this.getWorldPosition(_position));
        const lightLevelAt = lightInfoAt?.intensity || 0;
        const lightSignalLevel = (lightLevelAt >= 10) ? 1 : 0;
        this.setEnabled(lightSignalLevel > 0);
        return Rotations.all.map(x => ({ rotation: x, signal: { type: "light", value: lightSignalLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.color(value ? 'white' : 'black');
    }
}
