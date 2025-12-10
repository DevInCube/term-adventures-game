import { Controls } from "../controls";
import { Colors } from "../engine/math/Colors";
import { Vector2 } from "../engine/math/Vector2";
import { UIDialog } from "./UIDialog";
import { UIText } from "./UIText";

export class UIKeysDialog extends UIDialog {
    private uiTexts: UIText[] = [];

    constructor(cameraSize: Vector2) {
        const dialogWidth = cameraSize.width;
        const dialogHeight = cameraSize.height;
        const position = new Vector2(0, cameraSize.height - dialogHeight);
        const size = new Vector2(dialogWidth, dialogHeight);
        super(size, null);

        this.position = position;
        this.refresh();
    }

    handleControls(): void {
        super.handleControls();
        if (Controls.Keys.isDown && !Controls.Keys.isHandled) {
            this.close();
            Controls.Keys.isHandled = true;
        }
    }

    public refresh() {
        for (const text of this.uiTexts) {
            text.removeFromParent();
        }

        this.uiTexts = [];

        const controlEntries = Object.entries(Controls);
        let y = 2;
        
        const title = new UIText(this.uiPanel, "Controls", Colors.Yellow, Colors.Transparent);
        title.position = new Vector2(2, 1);
        this.uiTexts.push(title);

        for (const [name, control] of controlEntries) {
            const keyName = this.formatKeyCode(control.code);
            const text = `${name.padEnd(10)} ${keyName}`;
            const uiText = new UIText(this.uiPanel, text, Colors.White, Colors.Transparent);
            uiText.position = new Vector2(2, y);
            this.uiTexts.push(uiText);
            y += 1;
        }
    }

    private formatKeyCode(code: string): string {
        if (code.startsWith("Key")) {
            return code.substring(3);
        }

        return code.toUpperCase();
    }
}

