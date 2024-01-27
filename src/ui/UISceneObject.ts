import { CanvasContext } from "../engine/graphics/CanvasContext";
import { drawObjectAt } from "../engine/graphics/GraphicsEngine";
import { Object2D } from "../engine/objects/Object2D";
import { UIElement } from "./UIElement";

export class UISceneObject extends UIElement {
    constructor(
        parent: UIElement,
        private sceneObject: Object2D
    ) {
        super(parent);
    }

    draw(ctx: CanvasContext): void {
        drawObjectAt(ctx, undefined, this.sceneObject, this.getAbsolutePosition(), "ui");
        super.draw(ctx);
    }
}
