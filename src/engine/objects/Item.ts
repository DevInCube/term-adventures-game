import { GameObjectAction, SceneObject } from "./SceneObject";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Vector2 } from "../data/Vector2";

export class Item extends SceneObject {
    constructor(
        originPoint: Vector2, 
        skin: ObjectSkin, 
        physics: ObjectPhysics = new ObjectPhysics(), 
        position: Vector2 = Vector2.zero) {
            
        super(originPoint, skin, physics, position);
    }

    setUsage(action: GameObjectAction) {
        this.setAction({
            type: "usage",
            action,
        });
    }

    static create(type: string, skin: ObjectSkin, physics: ObjectPhysics = new ObjectPhysics()): Item {
        const item = new Item(Vector2.zero, skin, physics);
        item.type = type;
        return item;
    }
}