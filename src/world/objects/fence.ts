import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";

export function fence(options: { position: [number, number]; }) {
    return new StaticGameObject(
        [0, 0],
        new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
        new ObjectPhysics('.'),
        options.position);
}
