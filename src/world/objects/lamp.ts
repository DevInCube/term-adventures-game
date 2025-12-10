import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkinBuilder } from "../../engine/data/ObjectSkinBuilder";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { Colors } from "../../engine/math/Colors";

export class Lamp extends Object2D {
    private static _intensity: string = 'F';
    
    constructor(
        options: { 
            position: [number, number]; 
            isOn?: boolean;
        },
    ) {
        const origin = new Vector2(0, 2);
        const physics = new ObjectPhysics()
            .collision(origin)
            .light(Lamp._intensity);
        const skin = new ObjectSkinBuilder(`
⬤
█
█
`, `
L
H
H
`, {
            'L': [Colors.Yellow, Colors.Transparent],
            'H': [Colors.Gray, Colors.Transparent],
        }).build()
        super(origin,
            skin,
            physics,
            Vector2.from(options.position));
        this.setLampState(options.isOn === true);
        this.setAction({
            position: origin, 
            action: (ctx) => (ctx.obj as Lamp).toggle(),
            iconPosition: Vector2.zero
        });
    }

    private setLampState(isOn: boolean) {
        const o = this;
        o.parameters["is_on"] = isOn;
        o.skin.color(isOn ? Colors.Yellow : Colors.Black);
        o.physics.lights[0].intensity = Number.parseInt(isOn ? Lamp._intensity : '0', 16);
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
