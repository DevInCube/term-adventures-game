import { Object2D } from "../../../engine/objects/Object2D";
import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";
import { Vector2 } from "../../../engine/math/Vector2";
import { ISignalProcessor } from "../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../engine/signaling/SignalTransfer";
import { Color } from "../../../engine/math/Color";
import { Rotations } from "../../../engine/math/Rotation";
import { Colors } from "../../../engine/math/Colors";

export class LightSource extends Object2D implements ISignalProcessor {
    private _isOn: boolean = false;
    private _color: Color;
    private _maxIntensity: number = 15;
    private _requiresSignal: boolean;
    private _mainSkin: ObjectSkin;

    constructor(
        options: {
            position: [number, number],
            depth?: number, // TODO: use proper 3d coordinates instead.
            color?: Color,
            intensity?: string,
            requiresSignal?: boolean,
        }
    ) {
        const origin = new Vector2(0, options.depth || 0);
        const lightColor = options.color || Colors.White;
        const physics = new ObjectPhysics()
            .light({
                intensity: Number.parseInt(options.intensity || 'F'),
                color: lightColor,
                position: Vector2.zero,
            })
            .signal({
                position: origin,
                outputs: Rotations.all,
                inputs: Rotations.all,
            });
        const mainSkin = new ObjectSkin().char(`⬤`).color(lightColor);
        const circleSkin = new ObjectSkin().char('⭘').color(lightColor);
        const skin = new CompositeObjectSkin([mainSkin, circleSkin]);
        super(origin,
            skin,
            physics,
            Vector2.from(options.position));
        this._mainSkin = mainSkin;
        this.type = "light_source";
        this._color = lightColor;
        this._maxIntensity = Number.parseInt(options.intensity || 'F', 16);
        this._requiresSignal = typeof options.requiresSignal === "undefined" ? true : options.requiresSignal;
        this.setAction(ctx => (ctx.obj as LightSource).toggle());

        this.setLampState(!this._requiresSignal);
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        if (this._requiresSignal) {
            const isSignaled = transfers.filter(x => x.signal.value > 0).length > 0;
            this.setLampState(isSignaled);
        }
        
        return [];
    }
    
    private setLampState(isOn: boolean) {
        this._isOn = isOn;
        this._mainSkin.color(isOn ? this._color : Colors.Black);
        this.physics.lights[0].intensity = isOn ? this._maxIntensity : 0;
    }

    private toggle() {
        this.setLampState(!this._isOn);
    }
}
