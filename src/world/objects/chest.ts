import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { storageAction } from "../actions";
import { Vector2 } from "../../engine/data/Vector2";

export default class Chest extends StaticGameObject {
    constructor(position: Vector2) {
        super(
            Vector2.zero, 
            new ObjectSkin(`🧰`),
            new ObjectPhysics(`.`, ''),
            position);

        this.setAction(storageAction(this));
    }
}

export const chest = () => new Chest(Vector2.from([2, 10]));
