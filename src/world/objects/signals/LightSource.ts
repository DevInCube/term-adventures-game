import { Object2D } from "../../../engine/objects/Object2D";
import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../../engine/components/ObjectSkinBuilder";
import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { SidesHelper } from "../../../engine/math/Sides";
import { CompositeObjectSkin } from "../../../engine/components/CompositeObjectSkin";
import { Vector2 } from "../../../engine/math/Vector2";
import { ISignalProcessor, SignalTransfer } from "../../../engine/components/SignalCell";
import { Color } from "../../../engine/math/Color";

export class LightSource extends Object2D implements ISignalProcessor {
    private _isOn: boolean = false;
    private _color: string;
    private _maxIntensity: string = 'F';
    private _requiresSignal: boolean;
    private _mainSkin: ObjectSkin;

    constructor(options: { position: [number, number]; color: Color, intensity?: string, requiresSignal?: boolean }) {
        const physics = new ObjectPhysics(` `, `x`);
        physics.lightsMap = { 'x': { intensity: options.intensity || 'F', color: options.color }};
        physics.signalCells.push({
            position: new Vector2(),
            sides: SidesHelper.all(),
            inputSides: SidesHelper.all(),
        });
        const lightColor = options.color.getStyle();
        const mainSkin = new ObjectSkinBuilder(`⏺`, `L`, {
            'L': [undefined, 'transparent'],
        }).build();
        const skin = new CompositeObjectSkin([mainSkin, new ObjectSkinBuilder('⭘', '.', { '.': [lightColor, 'transparent'] }).build()]);
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

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        if (this._requiresSignal) {
            const isSignaled = transfers.filter(x => x.signal.value > 0).length > 0;
            this.setLampState(isSignaled);
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
