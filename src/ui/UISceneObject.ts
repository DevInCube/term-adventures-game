import { Object2D } from "../engine/objects/Object2D";
import { UIElement } from "./UIElement";

export class UISceneObject extends UIElement {
    constructor(
        parent: UIElement,
        private sceneObject: Object2D
    ) {
        super(parent);
    }

    update(ticks: number): void {
        super.update(ticks);
        this.skin = this.sceneObject.skin;
    }
}
