import { Object2D } from "./Object2D";
import { ObjectSkin as ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Vector2 } from "../math/Vector2";

export class StaticGameObject extends Object2D {

    constructor(
        originPoint: Vector2,
        skin: ObjectSkin,
        physics: ObjectPhysics,
        position: Vector2 = Vector2.zero) {
        super(originPoint, skin, physics, position);
    }
}
