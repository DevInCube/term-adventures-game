import { Color } from "../math/Color";
import { Object2D } from "../objects/Object2D";

export class Light extends Object2D {
    public color: Color;

    // TODO: change intensity from [0..F] to [0..1] everywhere.
    constructor(
        color: Color,
        public intensity: number = 15) {
        super();

        this.color = new Color(color);
        this.type = "light";
    }
}
