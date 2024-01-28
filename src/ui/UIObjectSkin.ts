import { ObjectSkin } from "../engine/components/ObjectSkin";
import { UIElement } from "./UIElement";

export class UIObjectSkin extends UIElement {
    constructor(
        parent: UIElement,
        skin: ObjectSkin
    ) {
        super(parent);
        this.skin = skin;
    }
}
