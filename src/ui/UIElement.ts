import { Vector2 } from "../engine/math/Vector2";
import { Object2D } from "../engine/objects/Object2D";

export abstract class UIElement extends Object2D {
    public size: Vector2;

    constructor(parent: UIElement | null) {
        super();
        this.layer = "ui";
        parent?.add(this as Object2D);
    }
}
