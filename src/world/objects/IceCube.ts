import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Vector2 } from "../../engine/math/Vector2";
import { Object2D } from "../../engine/objects/Object2D";

export class IceCube extends Object2D {
    constructor() {
        super(
            Vector2.zero,
            new ObjectSkin().char('🧊'),
            new ObjectPhysics().temperature('0'),
            Vector2.zero);
        this.type = "ice_cube";
    }
}
