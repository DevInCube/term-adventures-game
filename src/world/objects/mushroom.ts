import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";

export const mushroom = (options: { position: [number, number]; }) => {
    const physics = new ObjectPhysics(` `, `x`);
    physics.lightsMap = { 'x': { intensity: '8', color: [255, 255, 0] }};
    const object = new Object2D(Vector2.zero,
        new ObjectSkin(`🍄`),
        physics,
        Vector2.from(options.position));
    return object;
};
