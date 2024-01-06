import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Drawable } from "../engine/objects/SceneObject";

export abstract class UIElement implements Drawable {
    public position: [number, number] = [0, 0];
    public size: { width: number, height: number };
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

    getAbsolutePosition(): [number, number] {
        const pos: [number, number] = [...this.position];
        let parent = this.parent;
        while (parent) {
            pos[0] += parent.position[0];
            pos[1] += parent.position[1];
            parent = parent.parent;
        }

        return pos;
    }
}
