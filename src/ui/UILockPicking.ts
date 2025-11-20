import { Controls } from "../controls";
import { Vector2 } from "../engine/math/Vector2";
import { UIDialog } from "./UIDialog";
import { Chest } from "../world/objects/chest";
import { UIElement } from "./UIElement";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { Cell } from "../engine/graphics/Cell";
import { Grid } from "../engine/math/Grid";
import { UIText } from "./UIText";

class UILock extends UIElement {
    public isActive: boolean = false;
    public isSelected: boolean = false;
    public isUnlocked: boolean = false;
    public isFailed: boolean = false;

    constructor(
        parent: UIElement | null,
        private readonly pauseDurationTicks: number,
        private readonly activeDurationTicks: number,
    ) {
        super(parent);
    }

    public update(ticks: number): void {
        super.update(ticks);

        if (!this.isUnlocked && !this.isFailed) {
            this.isActive = this.ticks % (this.pauseDurationTicks + this.activeDurationTicks) >= this.pauseDurationTicks;
        }

        this.skin = this.createBackground();
    }

    private createBackground(): ObjectSkin {
        const cells: Cell[][] = [];
        const icon = this.isUnlocked ? '🔓' : '🔒';
        const color = this.isUnlocked ? 'green' : !this.isSelected ? 'gray' : this.isActive ? 'yellow' : 'red';
        cells[0] = [new Cell(icon, undefined, color)];
        const indicator = this.isSelected ? '^' : ' ';
        cells[1] = [new Cell(indicator, 'white', 'transparent')];
        
        const skin = new ObjectSkin(Grid.from(cells));
        return skin;
    } 
}

export class UILockPicking extends UIDialog {
    uiLocks: UILock[] = [];
    state: 'picking' | 'failed' | 'success' = 'picking';
    selectedLockIndex: number = -1;
    unlockedTitle: UIText;
    failedTitle: UIText;

    constructor(
        public object: Chest,
        public cameraSize: Vector2
    ) {
        const dialogWidth = cameraSize.width;
        const dialogHeight = cameraSize.height;
        const position = new Vector2(0, cameraSize.height - dialogHeight);
        const size = new Vector2(dialogWidth, dialogHeight);
        super(size, null);

        this.position = position;
        this.selectedLockIndex = 0;

        const x = 7;
        const y = this.uiPanel.size.y / 2;

        this.unlockedTitle = new UIText(this.uiPanel, "Unlocked", 'green', 'transparent');
        this.unlockedTitle.position = new Vector2(x - 1, y + 2);

        this.failedTitle = new UIText(this.uiPanel, "Failed", 'red', 'transparent');
        this.failedTitle.position = new Vector2(x, y + 2);
    }
    
    handleControls() {
        super.handleControls();

        if (this.state === 'picking') {
            const prevSelectedIndex = this.selectedLockIndex;

            const currentLock = this.uiLocks[this.selectedLockIndex];
            currentLock.isSelected = true;

            if (Controls.Interact.isDown && !Controls.Interact.isHandled) {
                currentLock.isUnlocked = currentLock.isActive;
                currentLock.isFailed = !currentLock.isActive;
                this.selectedLockIndex += currentLock.isUnlocked ? 1 : 0;
                if (!currentLock.isUnlocked) {
                    this.state = 'failed';
                } else if (this.selectedLockIndex >= this.uiLocks.length) {
                    this.selectedLockIndex = this.uiLocks.length - 1;
                    this.state = 'success';
                }

                Controls.Interact.isHandled = true;
            }

            if (prevSelectedIndex !== this.selectedLockIndex) {
                this.uiLocks[prevSelectedIndex].isSelected = false;
                this.uiLocks[this.selectedLockIndex].isSelected = true;
            }
        } else if (this.state === 'failed' || this.state === 'success') {
            const title = this.state === 'failed' ? this.failedTitle : this.unlockedTitle;
            title.visible = true;
            if (Controls.Interact.isDown && !Controls.Interact.isHandled) {
                this.close();
                Controls.Interact.isHandled = true;
            }
        }
    }

    public refresh() {
        this.uiLocks = [];
        for (const child of [...this.uiPanel.children]) {
            this.uiPanel.remove(child);
        }

        const locks = [
            new UILock(this.uiPanel, 1500, 450),
            new UILock(this.uiPanel, 1000, 250),
            new UILock(this.uiPanel, 500, 150),
            new UILock(this.uiPanel, 500, 250),
        ];
        const borderWidth = 1;
        const x = (this.uiPanel.size.width - this.uiLocks.length) / 2 - borderWidth * 2;
        const y = this.uiPanel.size.y / 2;
        this.uiLocks.push(...locks.map((lock, index) => lock.translateX(x + index).translateY(y)));

        const title = new UIText(this.uiPanel, "Pick the lock", 'white', 'transparent');
        title.position = new Vector2(3, y - 2);
        this.uiPanel.add(title);

        this.uiPanel.add(this.unlockedTitle);
        this.uiPanel.add(this.failedTitle);
        this.unlockedTitle.visible = false;
        this.failedTitle.visible = false;
        this.state = 'picking';
        this.selectedLockIndex = 0;
    }
}

