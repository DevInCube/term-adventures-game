import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { storageAction } from "../actions";
import { Vector2 } from "../../engine/math/Vector2";

export default class Chest extends Object2D {
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
