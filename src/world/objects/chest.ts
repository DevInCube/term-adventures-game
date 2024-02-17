import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { storageAction } from "../actions";
import { Vector2 } from "../../engine/math/Vector2";

export class Chest extends Object2D {
    constructor() {
        super(
            Vector2.zero, 
            new ObjectSkin().char(`🧰`),
            new ObjectPhysics().collision(),
            Vector2.zero);

        this.setAction(storageAction(this));
    }
}
