import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Scene } from "../../../../engine/Scene";
import { SidesHelper } from "../../../../engine/data/Sides";

export class LifeDetector extends StaticGameObject {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: [0, 0],
            sides: SidesHelper.all(),
            sourceOf: 0,
            detectorOf: {
                life: 1,
            },
        });
        super([0, 0], new ObjectSkin(`🙑`, `L`, {
            'L': ['black', 'gray'],
        }), physics, options.position);

        this.type = "life_detector";
    }

    update(ticks: number, scene: Scene): void {
        super.update(ticks, scene);

        const signalCell = this.physics.signalCells[0];
        if (signalCell.detectorOf?.life) {
            const [x, y] = this.position;
            const npcsAt = [
                scene.getNpcAt(this.position), 
                scene.getNpcAt([x, y + 1]),
                scene.getNpcAt([x, y - 1]),
                scene.getNpcAt([x + 1, y]),
                scene.getNpcAt([x - 1, y]),
            ];

            const lifeLevel = npcsAt.filter(x => x).length > 0 ? 1 : -1;
            signalCell.sourceOf = lifeLevel;

            this.skin.setForegroundAt([0, 0], lifeLevel > 0 ? 'lime' : 'black');
        }
    }
}
