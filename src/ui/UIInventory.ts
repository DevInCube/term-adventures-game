import { Controls } from "../controls";
import { Camera } from "../engine/Camera";
import { Vector2 } from "../engine/math/Vector2";
import { emitEvent } from "../engine/events/EventLoop";
import { Npc } from "../engine/objects/Npc";
import { SwitchGameModeGameEvent } from "../world/events/SwitchGameModeGameEvent";
import { UIElement } from "./UIElement";
import { UIItem } from "./UIItem";
import { UIPanel } from "./UIPanel";
import { UIEquipment } from "./UIEquipment";

export class UIInventory extends UIElement {
    uiPanel: UIPanel;
    uiEquipment: UIEquipment;
    uiItems: UIItem[] = [];
    selectedItemIndex: number = -1;

    get selectedItem() {
        return this.uiItems[this.selectedItemIndex].item;
    }

    constructor(
        public object: Npc,
        public camera: Camera
    ) {
        super(null);

        const dialogWidth = camera.size.width;
        const dialogHeight = camera.size.height / 2 - 3;
        this.position = new Vector2(0, camera.size.height - dialogHeight);
        const size = new Vector2(dialogWidth, dialogHeight);
        this.uiPanel = new UIPanel(this, new Vector2(), size);
        this.uiEquipment = new UIEquipment(this.uiPanel, object, this.uiItems);
        this.selectedItemIndex = 0;
    }
    
    handleControls() {
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
            emitEvent(SwitchGameModeGameEvent.create("inventory", "scene"));
            Controls.Inventory.isHandled = true;
        }

        if (prevSelectedIndex != this.selectedItemIndex) {
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

