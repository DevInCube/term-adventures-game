import { Controls } from "../controls";
import { Vector2 } from "../engine/math/Vector2";
import { Npc } from "../engine/objects/Npc";
import { UIItem } from "./UIItem";
import { UIEquipment } from "./UIEquipment";
import { UIDialog } from "./UIDialog";

export class UIInventory extends UIDialog {
    uiEquipment: UIEquipment;
    uiItems: UIItem[] = [];
    selectedItemIndex: number = -1;

    get selectedItem() {
        return this.uiItems[this.selectedItemIndex].item;
    }

    constructor(
        public object: Npc,
        public cameraSize: Vector2
    ) {
        const dialogWidth = cameraSize.width;
        const dialogHeight = cameraSize.height / 2 - 3;
        const position = new Vector2(0, cameraSize.height - dialogHeight);
        const size = new Vector2(dialogWidth, dialogHeight);
        super(size, null);

        this.position = position;
        this.uiEquipment = new UIEquipment(this.uiPanel, object, this.uiItems);
        this.selectedItemIndex = 0;
    }
    
    handleControls() {
        super.handleControls();
        const prevSelectedIndex = this.selectedItemIndex;

        if (Controls.Down.isDown && !Controls.Down.isHandled) {
            this.selectedItemIndex = Math.min(this.selectedItemIndex + 1, this.uiItems.length - 1);
            Controls.Down.isHandled = true;
        }
        
        if (Controls.Up.isDown && !Controls.Up.isHandled) {
            this.selectedItemIndex = Math.max(this.selectedItemIndex - 1, 0);
            Controls.Up.isHandled = true;
        }

        if (Controls.Interact.isDown && !Controls.Interact.isHandled) {
            if (this.object instanceof Npc) {
                this.object.equipment.equip(this.selectedItem);
            }
            Controls.Interact.isHandled = true;
        }

        if (Controls.Inventory.isDown && !Controls.Inventory.isHandled) {
            this.close();
            Controls.Inventory.isHandled = true;
        }

        if (prevSelectedIndex !== this.selectedItemIndex) {
            this.uiItems[prevSelectedIndex].isSelected = false;
            this.uiItems[this.selectedItemIndex].isSelected = true;
        }
    }

    public refresh() {
        this.uiItems = [];
        for (const child of [...this.uiPanel.children]) {
            this.uiPanel.remove(child);
        }

        let index = 0;
        for (const item of this.object.inventory.items) {
            const uiItem = new UIItem(this.uiPanel, item, new Vector2(2, 1 + index));
            uiItem.isSelected = index === this.selectedItemIndex; 
            this.uiItems.push(uiItem);
            index += 1;
        }

        this.uiEquipment.removeFromParent();
        this.uiEquipment = new UIEquipment(this.uiPanel, this.object, this.uiItems);
        this.uiEquipment.position = new Vector2(1, 1);
    }
}

