import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Scene } from "../../../../engine/Scene";
import { SidesHelper } from "../../../../engine/data/Sides";
import { Vector2 } from "../../../../engine/data/Vector2";

export class LightDetector extends StaticGameObject {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.all(),
            sourceOf: 0,
            detectorOf: {
                light: 10,
            },
        });
        super(Vector2.zero, new ObjectSkin(`☀️`, `L`, {
            'L': ['black', 'gray'],
        }), physics, Vector2.from(options.position));

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
