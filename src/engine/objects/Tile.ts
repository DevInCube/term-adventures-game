import { SceneObject } from "./SceneObject";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { TileCategory } from "./TileCategory";

export class Tile extends SceneObject {
    public category: TileCategory;
    public movementPenalty: number = 1; 

    constructor(
        skin: ObjectSkin,
        position: [number, number]) {

        super([0, 0], skin, new ObjectPhysics(), position);
    }
}
