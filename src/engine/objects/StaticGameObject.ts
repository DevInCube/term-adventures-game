import { SceneObject } from "./SceneObject";
import { ObjectSkin as ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";

export class StaticGameObject extends SceneObject {

    constructor(
        originPoint: [number, number],
        skin: ObjectSkin,
        physics: ObjectPhysics,
        position: [number, number] = [0, 0]) {
        super(originPoint, skin, physics, position);
    }
}
