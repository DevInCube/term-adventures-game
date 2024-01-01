import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";


export const lightSource = (options: { position: [number, number]; color: [number, number, number] }) => {
    const physics = new ObjectPhysics(` `, `x`);
    physics.lightsMap = { 'x': { intensity: 'F', color: options.color }};
    const object = new StaticGameObject([0, 0],
        new ObjectSkin(`⚪`, `L`, {
            'L': [undefined, 'transparent'],
        }),
        physics,
        options.position);
    object.parameters["is_on"] = true;
    object.setAction(ctx => {
        ctx.obj.parameters["is_on"] = !ctx.obj.parameters["is_on"];
        physics.lightsMap!['x'].intensity = ctx.obj.parameters["is_on"] ? 'F' : '0';
    });
    return object;
};
