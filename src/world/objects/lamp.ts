import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";

export class Lamp extends Object2D {
    constructor(
        options: { 
            position: [number, number]; 
            isOn?: boolean;
        },
    ) {
        const physics = new ObjectPhysics(` 
 
.`, `B`);
        super(new Vector2(0, 2),
            new ObjectSkinBuilder(`⬤
█
█`, `L
H
H`, {
            'L': ['yellow', 'transparent'],
            'H': ['#666', 'transparent'],
        }).build(),
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
