import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";

export const lamp = (options: { position: [number, number]; }) => {
    const object = new StaticGameObject([0, 2],
        new ObjectSkin(`⬤
█
█`, `L
H
H`, {
            'L': ['yellow', 'transparent'],
            'H': ['#666', 'transparent'],
        }),
        new ObjectPhysics(` 
 
.`, `B`), options.position);
    object.parameters["is_on"] = true;
    object.setAction(0, 2, (ctx) => {
        const o = ctx.obj;
        o.parameters["is_on"] = !o.parameters["is_on"];
        o.skin.raw_colors[0][0][0] = o.parameters["is_on"] ? 'yellow' : 'gray';
        o.physics.lights[0] = o.parameters["is_on"] ? 'B' : '0';
    }, 0, 0);
    return object;
};
