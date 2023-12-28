import { SceneObject } from "./SceneObject";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";

export class Tile extends SceneObject {
    constructor(
        skin: ObjectSkin,
        position: [number, number]) {

        super([0, 0], skin, new ObjectPhysics(), position);
    }
}
