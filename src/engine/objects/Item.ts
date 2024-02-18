import { GameObjectAction, Object2D } from "./Object2D";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Vector2 } from "../math/Vector2";
import { Effect } from "../effects/Effect";

export class Item extends Object2D {
    isItem = true;
    effects: Effect[] = [];

    constructor(
        originPoint: Vector2, 
        skin: ObjectSkin, 
        physics: ObjectPhysics = new ObjectPhysics(), 
        position: Vector2 = Vector2.zero,
    ) {
        super(originPoint, skin, physics, position);
    }

    setUsage(action: GameObjectAction) {
        this.setAction({
            type: "usage",
            action,
        });
    }

    static create(
        type: string,
        skin: ObjectSkin,
        physics: ObjectPhysics = new ObjectPhysics()
    ): Item {
        const item = new Item(Vector2.zero, skin, physics);
        item.type = type;
        return item;
    }
}