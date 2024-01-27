import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { SidesHelper } from "../../../../engine/math/Sides";
import { Vector2 } from "../../../../engine/math/Vector2";
import { ISignalProcessor, SignalTransfer } from "../../../../engine/components/SignalCell";
import { Faces } from "../../../../engine/math/Face";

export class WeatherDetector extends StaticGameObject implements ISignalProcessor {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics(` `);
        physics.signalCells.push({
            position: Vector2.zero,
            sides: SidesHelper.all(),
        });
        super(Vector2.zero, new ObjectSkin(`🗲`, `L`, {
            'L': ['black', 'gray'],
        }), physics, Vector2.from(options.position));

        this.type = "weather_detector";
    }

    processSignalTransfer(transfers:  SignalTransfer[]): SignalTransfer[] {
        const weatherAt = this.scene!.getWeatherAt(this.position);
        const weatherLevel = (weatherAt && weatherAt !== "normal") ? 1 : 0;
        this.setEnabled(weatherLevel > 0);
        return Faces.map(x => ({ direction: x, signal: { type: "weather", value: weatherLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.setForegroundAt([0, 0], value ? 'white' : 'black');
    }
}
