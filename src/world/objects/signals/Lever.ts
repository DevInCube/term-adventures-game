import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { Orientation } from "../../../engine/math/Orientation";
import { Vector2 } from "../../../engine/math/Vector2";
import { Sprite } from "../../../engine/data/Sprite";
import { Object2D } from "../../../engine/objects/Object2D";
import { ISignalProcessor } from "../../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../../engine/signaling/SignalTransfer";
import { Rotations } from "../../../engine/math/Rotation";

export class Lever extends Object2D implements ISignalProcessor {
    private _isOn: boolean = false;
    private _sprite: Sprite;

    constructor(options: { position: [number, number]; orientation?: Orientation; }) {
        const physics = new ObjectPhysics().signal({
            position: Vector2.zero,
            inputs: Rotations.none,
            outputs: Rotations.all,
        });
        const sprite = Sprite.parseSimple('⫰⫯');
        sprite.frames["0"][0].color('black');
        sprite.frames["0"][0].background('gray');
        sprite.frames["1"][0].color('yellow');
        sprite.frames["1"][0].background('gray');
        super(Vector2.zero, sprite.frames["1"][0], physics, Vector2.from(options.position));

        this._sprite = sprite;
        
        this.type = "lever";
        this.setAction(ctx => (ctx.obj as Lever).toggle());

        this.setOn(false);
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        if (!this._isOn) {
            return [];
        }

        return Rotations.all.map(x => ({ rotation: x, signal: { type: "mind", value: 1 } }));
    }

    private toggle() {
        this.setOn(!this._isOn);
    }

    private setOn(isOn: boolean) {
        this._isOn = isOn;
        const frameIndex = Number(this._isOn).toString();
        this.skin = this._sprite.frames[frameIndex][0];
    }
}
