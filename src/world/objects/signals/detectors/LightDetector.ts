import { Object2D } from "../../../../engine/objects/Object2D";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { SidesHelper } from "../../../../engine/math/Sides";
import { Vector2 } from "../../../../engine/math/Vector2";
import { ISignalProcessor } from "../../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../../engine/signaling/SignalTransfer";
import { Faces } from "../../../../engine/math/Face";

export class LightDetector extends Object2D implements ISignalProcessor {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            sides: SidesHelper.all(),
        });
        super(Vector2.zero, new ObjectSkin().char(`☀️`).color('black').background('gray'), physics, Vector2.from(options.position));

        this.type = "light_detector";
    }

    processSignalTransfer(transfers:  SignalTransfer[]): SignalTransfer[] {
        const lightInfoAt = this.scene!.lights.getLightInfoAt(this.position);
        const lightLevelAt = lightInfoAt?.intensity || 0;
        const lightSignalLevel = (lightLevelAt >= 10) ? 1 : 0;
        this.setEnabled(lightSignalLevel > 0);
        return Faces.map(x => ({ direction: x, signal: { type: "light", value: lightSignalLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.color(value ? 'white' : 'black');
    }
}
