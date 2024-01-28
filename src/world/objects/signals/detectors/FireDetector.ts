import { Object2D } from "../../../../engine/objects/Object2D";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../../../engine/components/ObjectSkinBuilder";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { SidesHelper } from "../../../../engine/math/Sides";
import { Vector2 } from "../../../../engine/math/Vector2";
import { ISignalProcessor, SignalTransfer } from "../../../../engine/components/SignalCell";
import { Faces } from "../../../../engine/math/Face";

export class FireDetector extends Object2D implements ISignalProcessor  {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.all(),
        });
        super(Vector2.zero, new ObjectSkinBuilder(`㊋`, `L`, {
            'L': ['black', 'gray'],
        }).build(), physics, Vector2.from(options.position));

        this.type = "fire_detector";
    }

    processSignalTransfer(transfers:  SignalTransfer[]): SignalTransfer[] {
        const temperatureAt = this.scene!.getTemperatureAt(this.position);
        const temperatureLevel = (temperatureAt >= 8) ? 1 : 0;
        this.setEnabled(temperatureLevel > 0);
        return Faces.map(x => ({ direction: x, signal: { type: "fire", value: temperatureLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.setForegroundAt([0, 0], value ? 'red' : 'black');
    }
}
