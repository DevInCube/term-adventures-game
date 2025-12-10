import { ObjectSkin } from "../engine/components/ObjectSkin";
import { Color } from "../engine/math/Color";
import { createTextObjectSkin } from "../utils/misc";
import { UIElement } from "./UIElement";

export class UIText extends UIElement {
    skin: ObjectSkin;

    constructor(
        parent: UIElement,
        public text: string = '',
        public color?: Color,
        public background?: Color,
    ) {
        super(parent);

        this.skin = createTextObjectSkin(text, color, background);
    }
}
