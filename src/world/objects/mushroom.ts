import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";

export const mushroom = (options: { position: [number, number]; }) => {
    const physics = new ObjectPhysics(` `, `x`);
    physics.lightsMap = { 'x': { intensity: 'A', color: [255, 255, 0] }};
    const object = new StaticGameObject([0, 2],
        new ObjectSkin(`🍄`, `L`, {
            'L': ['yellow', 'transparent'],
        }),
        physics,
        options.position);
    return object;
};
