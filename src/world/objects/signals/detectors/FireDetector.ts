import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Scene } from "../../../../engine/Scene";
import { SidesHelper } from "../../../../engine/data/Sides";
import { Vector2 } from "../../../../engine/data/Vector2";
import { ISignalSource, SignalTransfer } from "../../../../engine/components/SignalCell";
import { Faces } from "../../../../engine/data/Face";

export class FireDetector extends StaticGameObject implements ISignalSource  {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.all(),
            detectorOf: {
                fire: 8,
            },
        });
        super(Vector2.zero, new ObjectSkin(`㊋`, `L`, {
            'L': ['black', 'gray'],
        }), physics, Vector2.from(options.position));

        this.type = "fire_detector";
    }

    updateSource(scene: Scene): SignalTransfer[] {
        const temperatureAt = scene.getTemperatureAt(this.position);
        const temperatureLevel = (temperatureAt >= 8) ? 1 : -1;
        this.setEnabled(temperatureLevel > 0);
        return Faces.map(x => ({ direction: x, signal: { type: "fire", value: temperatureLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.setForegroundAt([0, 0], value ? 'red' : 'black');
    }
}
