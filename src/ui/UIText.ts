import { ObjectSkin } from "../engine/components/ObjectSkin";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { drawObjectSkinAt } from "../engine/graphics/GraphicsEngine";
import { createTextObjectSkin } from "../utils/misc";
import { UIElement } from "./UIElement";

export class UIText extends UIElement {
    skin: ObjectSkin;

    constructor(
        parent: UIElement,
        public text: string = '',
        public color?: string,
        public background?: string,
    ) {
        super(parent);

        this.skin = createTextObjectSkin(text, color, background);
    }

    draw(ctx: CanvasContext) {
        super.draw(ctx);
        drawObjectSkinAt(ctx, undefined, this.skin, [0, 0], this.getAbsolutePosition(), "ui");
    }
}
