import { SceneObject } from "./SceneObject";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";

export class Item extends SceneObject {
    constructor(
        originPoint: [number, number], 
        skin: ObjectSkin, 
        physics: ObjectPhysics, 
        position: [number, number]) {
            
        super(originPoint, skin, physics, position);
    }
}