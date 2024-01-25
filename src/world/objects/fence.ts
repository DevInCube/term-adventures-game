import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/data/Vector2";

export function fence(options: { position: [number, number]; }) {
    const object = new StaticGameObject(
        Vector2.zero,
        new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
        new ObjectPhysics('.'),
        Vector2.from(options.position));
    object.type = "fence";
    return object;
}
