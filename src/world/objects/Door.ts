import { Object2D } from "../../engine/objects/Object2D";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { ObjectSkin } from "../../engine/components/ObjectSkin";

export class Door extends Object2D {
    constructor(
        options: { 
            position: [number, number]; 
            isOpened?: boolean;
        },
    ) {
        const origin = Vector2.zero;
        super(
            origin,
            new ObjectSkin(),
            new ObjectPhysics(),
            Vector2.from(options.position));
        this.type = "door";
        this.setDoorState(options.isOpened === true);
        this.setAction({
            position: Vector2.zero, 
            action: (ctx) => (ctx.obj as Door).toggle(),
            iconPosition: Vector2.zero,
        });
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
