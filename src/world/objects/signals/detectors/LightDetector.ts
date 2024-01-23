import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Scene } from "../../../../engine/Scene";
import { SidesHelper } from "../../../../engine/data/Sides";

export class LightDetector extends StaticGameObject {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: [0, 0],
            sides: SidesHelper.all(),
            sourceOf: 0,
            detectorOf: {
                light: 10,
            },
        });
        super([0, 0], new ObjectSkin(`☀️`, `L`, {
            'L': ['black', 'gray'],
        }), physics, options.position);

        this.type = "light_detector";
    }

    update(ticks: number, scene: Scene): void {
        super.update(ticks, scene);

        const signalCell = this.physics.signalCells[0];
        if (signalCell.detectorOf?.light) {
            const lightLevelAt = scene.getLightAt(this.position);
            const lightSignalLevel = (lightLevelAt >= signalCell.detectorOf.light) ? 1 : -1;
            signalCell.sourceOf = lightSignalLevel;

            this.skin.setForegroundAt([0, 0], lightSignalLevel > 0 ? 'white' : 'black');
        }
    }
}
