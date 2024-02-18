import { Object2D } from "../Object2D";

export class LayerObject extends Object2D {

    public disable() {
        this.enabled = false;
        this.visible = false;
        return this;
    }

    public toggle() {
        this.enabled = !this.enabled;
        this.visible = !this.visible;
        return this;
    }
}
