import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";

export class Lamp extends StaticGameObject {
    constructor(
        options: { 
            position: [number, number]; 
            isOn?: boolean;
        },
    ) {
        const physics = new ObjectPhysics(` 
 
.`, `B`);
        super([0, 2],
            new ObjectSkin(`⬤
█
█`, `L
H
H`, {
            'L': ['yellow', 'transparent'],
            'H': ['#666', 'transparent'],
        }),
        physics, options.position);
        this.setLampState(options.isOn === true);
        this.setAction({
            position: [0, 2], 
            action: (ctx) => (ctx.obj as Lamp).toggle(),
            iconPosition: [0, 0]
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
