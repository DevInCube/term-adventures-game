import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Object2D } from "../../engine/objects/Object2D";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { Colors } from "../../engine/math/Colors";

export function fence(options: { position: [number, number]; }) {
    const object = new Object2D(
        Vector2.zero,
        new ObjectSkin().char(`☗`).color(Colors.Sienna),
        new ObjectPhysics().collision(),
        Vector2.from(options.position));
    object.type = "fence";
    return object;
}
