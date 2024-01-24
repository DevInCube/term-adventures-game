import { StaticGameObject } from "../../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { SidesHelper } from "../../../engine/data/Sides";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";
import { Vector2 } from "../../../engine/data/Vector2";
import { ISignalInit, ISignalProcessor, SignalTransfer } from "../../../engine/components/SignalCell";

export class LightSource extends StaticGameObject implements ISignalInit, ISignalProcessor {
    private _isOn: boolean = false;
    private _color: string;
    private _maxIntensity: string = 'F';
    private _requiresSignal: boolean;
    private _mainSkin: ObjectSkin;

    constructor(options: { position: [number, number]; color: [number, number, number], intensity?: string, requiresSignal?: boolean }) {
        const physics = new ObjectPhysics(` `, `x`);
        physics.lightsMap = { 'x': { intensity: options.intensity || 'F', color: options.color }};
        physics.signalCells.push({
            position: new Vector2(),
            sides: SidesHelper.all(),
            inputSides: SidesHelper.all(),
        });
        const lightColor = `rgb(${options.color[0]}, ${options.color[1]}, ${options.color[2]})`;
        const mainSkin = new ObjectSkin(`⏺`, `L`, {
            'L': [undefined, 'transparent'],
        });
        const skin = new CompositeObjectSkin([mainSkin, new ObjectSkin('⭘', '.', { '.': [lightColor, 'transparent'] })]);
        super(Vector2.zero,
            skin,
            physics,
            Vector2.from(options.position));
        this._mainSkin = mainSkin;
        this.type = "light_source";
        this._color = lightColor;
        this._maxIntensity = options.intensity || 'F';
        this._requiresSignal = typeof options.requiresSignal === "undefined" ? true : options.requiresSignal;
        this.setAction(ctx => (ctx.obj as LightSource).toggle());

        this.setLampState(!this._requiresSignal);
    }

    initialize() {
        this.setLampState(false);
    }

    processSignalTransfer(transfer: SignalTransfer): SignalTransfer[] {
        const isSignaled = transfer.signal.value > 0;
        if (isSignaled) {
            this.setLampState(true);
        }
        
        return [];
    }
    
    private setLampState(isOn: boolean) {
        this._isOn = isOn;
        this._mainSkin.setForegroundAt([0, 0], isOn ? this._color : 'black');
        this.physics.lightsMap!['x'].intensity = isOn ? this._maxIntensity : '0';
    }

    private toggle() {
        this.setLampState(!this._isOn);
    }
}
