import { SceneObject } from "./SceneObject";
import { ObjectSkin as ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Vector2 } from "../data/Vector2";

export class StaticGameObject extends SceneObject {

    constructor(
        originPoint: Vector2,
        skin: ObjectSkin,
        physics: ObjectPhysics,
        position: Vector2 = Vector2.zero) {
        super(originPoint, skin, physics, position);
    }
}
