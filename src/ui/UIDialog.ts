import { Controls } from "../controls";
import { Vector2 } from "../engine/math/Vector2";
import { UIElement } from "./UIElement";
import { UIPanel } from "./UIPanel";

export class UIDialog extends UIElement {
    uiPanel: UIPanel;

    constructor(size: Vector2, parent: UIElement | null = null) {
        super(parent);

        this.close();
        this.uiPanel = new UIPanel(this, new Vector2(), size);
    }

    handleControls() {
        if (Controls.Escape.isDown && !Controls.Escape.isHandled) {
            this.close();
            Controls.Escape.isHandled = true;
        }
    }

    public open() {
        this.enabled = true;
        this.visible = true;
    }

    public close() {
        this.enabled = false;
        this.visible = false;
    }
}
