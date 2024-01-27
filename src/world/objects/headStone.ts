import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Object2D } from "../../engine/objects/Object2D";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";

export const headStone = (options: { position: [number, number]; }) => new Object2D(
    Vector2.zero,
    new ObjectSkin(`🪦`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    Vector2.from(options.position));
