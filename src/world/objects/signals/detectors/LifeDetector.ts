import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Scene } from "../../../../engine/Scene";
import { SidesHelper } from "../../../../engine/data/Sides";
import { Faces } from "../../../../engine/data/Face";
import { Vector2 } from "../../../../engine/data/Vector2";

export class LifeDetector extends StaticGameObject {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.all(),
            sourceOf: 0,
            detectorOf: {
                life: 1,
            },
        });
        super(Vector2.zero, new ObjectSkin(`🙑`, `L`, {
            'L': ['black', 'gray'],
        }), physics, Vector2.from(options.position));

        this.type = "life_detector";
    }

    update(ticks: number, scene: Scene): void {
        super.update(ticks, scene);

        const signalCell = this.physics.signalCells[0];
        if (signalCell.detectorOf?.life) {
            const npcsAt = [
                scene.getNpcAt(this.position), 
                ...Faces
                    .map(x => Vector2.fromFace(x))
                    .map(x => this.position.add(x))
                    .map(x => scene.getNpcAt(x))
            ];

            const lifeLevel = npcsAt.filter(x => x).length > 0 ? 1 : -1;
            signalCell.sourceOf = lifeLevel;

            this.skin.setForegroundAt([0, 0], lifeLevel > 0 ? 'lime' : 'black');
        }
    }
}
