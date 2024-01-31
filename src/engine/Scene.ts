import { Color } from "./math/Color";
import { Object2D } from "./objects/Object2D";

export class Scene extends Object2D {
    public isScene = true;
    public background: Color | undefined = undefined;

    constructor() {
        super();
    }
}
