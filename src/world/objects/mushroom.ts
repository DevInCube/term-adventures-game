import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";

// TODO: mushroom light spread is not consistent.
export const mushroom = (options: { position: [number, number]; }) => {
    const physics = new ObjectPhysics(` `, `x`);
    physics.lightsMap = { 'x': { intensity: '8', color: [255, 255, 0] }};
    const object = new StaticGameObject([0, 0],
        new ObjectSkin(`🍄`),
        physics,
        options.position);
    return object;
};
