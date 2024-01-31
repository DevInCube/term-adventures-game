import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { Color } from "../../engine/math/Color";

export const mushroom = (options: { position: [number, number]; }) => {
    const physics = new ObjectPhysics().light({ intensity: 8, color: new Color(1, 1, 0), position: new Vector2() });
    const object = new Object2D(Vector2.zero,
        new ObjectSkin().char(`🍄`),
        physics,
        Vector2.from(options.position));
    return object;
};
