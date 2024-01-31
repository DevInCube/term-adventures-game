import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { Object2D } from "../../engine/objects/Object2D";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";

export function fence(options: { position: [number, number]; }) {
    const object = new Object2D(
        Vector2.zero,
        new ObjectSkinBuilder(`☗`, '.', { '.': ['Sienna', 'transparent'] }).build(),
        new ObjectPhysics().collision(),
        Vector2.from(options.position));
    object.type = "fence";
    return object;
}
