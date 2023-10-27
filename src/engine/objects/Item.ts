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
    
    new () { 
        return new Item([0, 0], new ObjectSkin(), new ObjectPhysics(), [0, 0]); 
    }
}