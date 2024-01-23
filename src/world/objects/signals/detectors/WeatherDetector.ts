import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Scene } from "../../../../engine/Scene";
import { SidesHelper } from "../../../../engine/data/Sides";

export class WeatherDetector extends StaticGameObject {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: [0, 0],
            sides: SidesHelper.all(),
            sourceOf: 0,
            detectorOf: {
                weather: 1,
            },
        });
        super([0, 0], new ObjectSkin(`🗲`, `L`, {
            'L': ['black', 'gray'],
        }), physics, options.position);

        this.type = "weather_detector";
    }

    update(ticks: number, scene: Scene): void {
        super.update(ticks, scene);

        const signalCell = this.physics.signalCells[0];
        if (signalCell.detectorOf?.weather) {
            const weatherAt = scene.getWeatherAt(this.position);
            const weatherLevel = (weatherAt && weatherAt !== "normal") ? 1 : -1;
            signalCell.sourceOf = weatherLevel;

            this.skin.setForegroundAt([0, 0], weatherLevel > 0 ? 'cyan' : 'black');
        }
    }
}
