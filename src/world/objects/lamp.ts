import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";

export class Lamp extends StaticGameObject {
    constructor(
        options: { 
            position: [number, number]; 
            isOn?: boolean;
        },
    ) {
        const physics = new ObjectPhysics(` 
 
.`, `B`);
        super(new Vector2(0, 2),
            new ObjectSkin(`⬤
█
█`, `L
H
H`, {
            'L': ['yellow', 'transparent'],
            'H': ['#666', 'transparent'],
        }),
        physics, Vector2.from(options.position));
        this.setLampState(options.isOn === true);
        this.setAction({
            position: new Vector2(0, 2), 
            action: (ctx) => (ctx.obj as Lamp).toggle(),
            iconPosition: Vector2.zero
        });
    }

    private setLampState(isOn: boolean) {
        const o = this;
        o.parameters["is_on"] = isOn;
        o.skin.setForegroundAt([0, 0], isOn ? 'yellow' : 'black');
        o.physics.lights[0] = isOn ? 'B' : '0';
    }

    private toggle() {
        const isOn = this.parameters["is_on"];
        this.setLampState(!isOn);
    }
}

export const lamp = (options: { position: [number, number]; isOn?: boolean }) => {
    const object = new Lamp(options);
    return object;
};
