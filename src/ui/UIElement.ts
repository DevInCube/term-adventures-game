import { Vector2 } from "../engine/data/Vector2";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Drawable } from "../engine/objects/SceneObject";

export abstract class UIElement implements Drawable {
    public position: Vector2 = Vector2.zero;
    public size: Vector2;
    public children: UIElement[] = [];

    constructor(public parent: UIElement | null) {
        if (parent) {
            parent.children.push(this);
        }
    }

    draw(ctx: CanvasContext): void {
        for (const child of this.children) {
            child.draw(ctx);
        }
    }

    remove(element: UIElement | null) {
        if (!element) {
            return;
        }

        if (element.parent !== this) {
            return;
        }

        element.parent = null;
        this.children = this.children.filter(x => x !== element);
    }

    getAbsolutePosition(): Vector2 {
        let pos = this.position.clone();
        let parent = this.parent;
        while (parent) {
            pos.add(parent.position);
            parent = parent.parent;
        }

        return pos;
    }
}
