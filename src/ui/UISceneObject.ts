import { CanvasContext } from "../engine/graphics/CanvasContext";
import { drawObjectAt } from "../engine/graphics/GraphicsEngine";
import { SceneObject } from "../engine/objects/SceneObject";
import { UIElement } from "./UIElement";

export class UISceneObject extends UIElement {
    constructor(
        parent: UIElement,
        private sceneObject: SceneObject
    ) {
        super(parent);
    }

    draw(ctx: CanvasContext): void {
        drawObjectAt(ctx, undefined, this.sceneObject, this.getAbsolutePosition(), "ui");
        super.draw(ctx);
    }
}
