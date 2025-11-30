import { Object2D } from "../../engine/objects/Object2D";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Rotations } from "../../engine/math/Rotation";
import { ISignalProcessor } from "../../engine/signaling/ISignalProcessor";
import { SignalTransfer } from "../../engine/signaling/SignalTransfer";

export class Door extends Object2D implements ISignalProcessor {
    private _requiresSignal: boolean;
    private _isSignaled: boolean = false;

    constructor(
        options: { 
            position: [number, number]; 
            isOpened?: boolean;
            requiresSignal?: boolean,
        },
    ) {
        const origin = Vector2.zero;
        const physics = new ObjectPhysics()
            .signal({
                position: Vector2.zero,
                outputs: Rotations.all,
                inputs: Rotations.all,
            });
        super(
            origin,
            new ObjectSkin(),
            physics,
            Vector2.from(options.position));
        this.type = "door";
        this.setDoorState(options.isOpened === true);
        this._requiresSignal = typeof options.requiresSignal === "undefined" ? false : options.requiresSignal;
        this.setAction({
            position: Vector2.zero, 
            action: (ctx) => {
                const door = ctx.obj as Door;
                if (!door._requiresSignal) {
                    door.toggle();
                }
            },
            iconPosition: Vector2.zero,
        });
    }

    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[] {
        const isSignaled = transfers.filter(x => x.signal.value > 0).length > 0;
        if (this._isSignaled != isSignaled) {
            this.setDoorState(isSignaled);
            this._isSignaled = isSignaled;
        }

        return [];
    }

    private setDoorState(isOpened: boolean) {
        const o = this;
        o.parameters["is_opened"] = isOpened;
        o.physics.collisions = isOpened ? [] : [Vector2.zero];
        o.physics.material({ position: Vector2.zero, opacity: isOpened ? 0 : 1 });
        o.skin.char(isOpened ? `𓉸` : `🚪`);
    }

    private toggle() {
        const isOpened = this.parameters["is_opened"];
        this.setDoorState(!isOpened);
    }
}

export const door = (options: { position: [number, number]; isOpened?: boolean }) => {
    const object = new Door(options);
    return object;
};
