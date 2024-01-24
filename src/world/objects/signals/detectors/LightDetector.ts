import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Scene } from "../../../../engine/Scene";
import { SidesHelper } from "../../../../engine/data/Sides";
import { Vector2 } from "../../../../engine/data/Vector2";
import { ISignalSource, SignalTransfer } from "../../../../engine/components/SignalCell";
import { Faces } from "../../../../engine/data/Face";

export class LightDetector extends StaticGameObject implements ISignalSource {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.all(),
            detectorOf: {
                light: 10,
            },
        });
        super(Vector2.zero, new ObjectSkin(`☀️`, `L`, {
            'L': ['black', 'gray'],
        }), physics, Vector2.from(options.position));

        this.type = "light_detector";
    }

    updateSource(scene: Scene): SignalTransfer[] {
        const lightLevelAt = scene.getLightAt(this.position);
        const lightSignalLevel = (lightLevelAt >= 10) ? 1 : -1;
        this.setEnabled(lightSignalLevel > 0);
        return Faces.map(x => ({ direction: x, signal: { type: "light", value: lightSignalLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.setForegroundAt([0, 0], value ? 'white' : 'black');
    }
}
