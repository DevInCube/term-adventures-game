import { ObjectSkin } from "../engine/components/ObjectSkin";
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
}
