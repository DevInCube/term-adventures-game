import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Scene } from "../../../../engine/Scene";
import { SidesHelper } from "../../../../engine/data/Sides";

export class FireDetector extends StaticGameObject {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: [0, 0],
            sides: SidesHelper.all(),
            sourceOf: 0,
            detectorOf: {
                fire: 8,
            },
        });
        super([0, 0], new ObjectSkin(`㊋`, `L`, {
            'L': ['black', 'gray'],
        }), physics, options.position);

        this.type = "fire_detector";
    }

    update(ticks: number, scene: Scene): void {
        super.update(ticks, scene);

        const signalCell = this.physics.signalCells[0];
        if (signalCell.detectorOf?.fire) {
            const temperatureAt = scene.getTemperatureAt(this.position);
            const temperatureLevel = (temperatureAt >= signalCell.detectorOf.fire) ? 1 : -1;
            signalCell.sourceOf = temperatureLevel;

            this.skin.setForegroundAt([0, 0], temperatureLevel > 0 ? 'red' : 'black');
        }
    }
}
