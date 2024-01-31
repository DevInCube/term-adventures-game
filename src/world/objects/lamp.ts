import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkinBuilder } from "../../engine/data/ObjectSkinBuilder";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";

export class Lamp extends Object2D {
    constructor(
        options: { 
            position: [number, number]; 
            isOn?: boolean;
        },
    ) {
        const origin = new Vector2(0, 2);
        const physics = new ObjectPhysics().collision(origin).light(`B`);
        super(origin,
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
        o.skin.color(isOn ? 'yellow' : 'black');
        o.physics.lights[0].intensity = Number.parseInt(isOn ? 'B' : '0', 16);
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
