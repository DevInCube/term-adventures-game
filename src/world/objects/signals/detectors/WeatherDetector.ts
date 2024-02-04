import { Object2D } from "../../../../engine/objects/Object2D";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { Vector2 } from "../../../../engine/math/Vector2";
import { ISignalProcessor } from "../../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../../engine/signaling/SignalTransfer";
import { Rotations } from "../../../../engine/math/Rotation";

export class WeatherDetector extends Object2D implements ISignalProcessor {
    constructor(options: { position: [number, number]; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            inputs: Rotations.none,
            outputs: Rotations.all,
        });
        super(Vector2.zero, new ObjectSkin().char(`🗲`).color('black').background('gray'), physics, Vector2.from(options.position));

        this.type = "weather_detector";
    }

    processSignalTransfer(transfers:  SignalTransfer[]): SignalTransfer[] {
        const weatherAt = this.scene!.weather.getWeatherInfoAt(this.globalPosition).weatherType;
        const weatherLevel = (weatherAt && weatherAt !== "normal") ? 1 : 0;
        this.setEnabled(weatherLevel > 0);
        return Rotations.all.map(x => ({ rotation: x, signal: { type: "weather", value: weatherLevel } }));
    }

    private setEnabled(value: boolean) {
        this.skin.color(value ? 'cyan' : 'black');
    }
}
