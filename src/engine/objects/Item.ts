import { GameObjectAction, SceneObject } from "./SceneObject";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";

export class Item extends SceneObject {
    constructor(
        originPoint: [number, number], 
        skin: ObjectSkin, 
        physics: ObjectPhysics = new ObjectPhysics(), 
        position: [number, number] = [0, 0]) {
            
        super(originPoint, skin, physics, position);
    }

    setUsage(action: GameObjectAction) {
        this.setAction({
            type: "usage",
            action,
        });
    }

    static create(type: string, skin: ObjectSkin, physics: ObjectPhysics = new ObjectPhysics()): Item {
        const item = new Item([0, 0], skin, physics);
        item.type = type;
        return item;
    }
}