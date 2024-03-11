import { Npc } from "../engine/objects/Npc";
import { Object2D } from "../engine/objects/Object2D";
import { Scene } from "../engine/Scene";
import { Camera } from "../engine/cameras/Camera";
import { getNpcInteraction } from "../engine/ActionData";
import { UIPanel } from "./UIPanel";
import { UIElement } from "./UIElement";
import { UISceneObject } from "./UISceneObject";
import { HealthBarUi } from "./HealthBarUi";
import { Vector2 } from "../engine/math/Vector2";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { UIObjectSkin } from "./UIObjectSkin";
import { Grid } from "../engine/math/Grid";
import { Cell } from "../engine/graphics/Cell";
import { isRangedItem } from "../world/items";

const _position = new Vector2();
const _position2 = new Vector2();

export class PlayerUi extends UIElement {
    objectUnderCursor: Object2D | null = null;
    actionUnderCursor: ObjectSkin | null = null;
    heroSprite: UISceneObject;
    heroHealthBar: HealthBarUi;
    objectUnderCursorSprite: UIObjectSkin | null = null;
    actionUnderCursorSprite: UIObjectSkin | null = null;
    objectUnderCursorHealthBar: HealthBarUi | null = null;
    range: UIObjectSkin | null = null;
    panel: UIPanel;

    constructor(
        public npc: Npc,
        public camera: Camera
    ) {
        super(null);

        this.panel = new UIPanel(this, Vector2.zero, new Vector2(camera.size.width, 1));
        this.panel.borderColor = '#000a';
        this.heroSprite = new UISceneObject(this, npc);
        this.heroSprite.position = Vector2.zero;
        this.heroHealthBar = new HealthBarUi(this, npc);
        this.heroHealthBar.position = new Vector2(1, 0);
    }

    private getNpcUnderCursor(scene: Scene): Npc | undefined {
        const npcObjects = scene.children
            .filter(x => x.enabled && x instanceof Npc)
            .map(x => x as Npc);
        const npcCursorPosition = this.npc.getWorldCursorPosition(_position2);
        for (let o of npcObjects) {
            if (o.getWorldPosition(_position).equals(npcCursorPosition)) {
                return o;
            }
        }

        return undefined;
    }

    private getRange(parent: UIElement, position: Vector2, range: number): UIObjectSkin {
        const offset = new Vector2(range, range);
        const grid = new Grid<Cell>(new Vector2(2 * range + 1, 2 * range + 1));
        const buffer = new Vector2();
        const highlightCell = new Cell(' ', undefined, '#ff04');
        const d = new Vector2();
        for (d.y = -range; d.y <= range; d.y++) {
            for (d.x = -range; d.x <= range; d.x++) {
                if (d.length > range) {
                    continue;
                }

                const result = buffer.copy(offset).add(d);
                grid.setAt(result, highlightCell);
            }
        }

        const skin = new ObjectSkin(grid);
        const skinEl = new UIObjectSkin(parent, skin);
        skinEl.position = position.clone().sub(offset);
        return skinEl;
    }

    update(ticks: number) {
        super.update(ticks);
        this.objectUnderCursor = null;
        this.actionUnderCursor = null;

        const right = this.camera.size.width - 1;

        if (this.npc.scene) {
            if (this.range) {
                this.remove(this.range);
            }

            if (this.npc.enabled &&
                this.npc.equipment.objectInMainHand &&
                isRangedItem(this.npc.equipment.objectInMainHand)
            ) {
                const range = this.npc.equipment.objectInMainHand.range;
                const position = this.npc.getWorldPosition(new Vector2());
                this.range = this.getRange(this, position, range);
            } else {
                this.range = null;
            }

            const npcUnderCursor = this.npc.target && this.npc.target.enabled
                ? this.npc.target
                : this.getNpcUnderCursor(this.npc.scene);
            if (this.npc.enabled && npcUnderCursor) {
                if (npcUnderCursor !== this.objectUnderCursor) {
                    npcUnderCursor.highlighted = true;
                    this.objectUnderCursor = npcUnderCursor;

                    this.remove(this.objectUnderCursorSprite!);
                    this.remove(this.objectUnderCursorHealthBar!);
                    // TODO: this is re-created each tick, so they are not updated.
                    this.objectUnderCursorHealthBar = new HealthBarUi(this, npcUnderCursor);
                    const digits = this.objectUnderCursorHealthBar.skin.size.width;
                    this.objectUnderCursorHealthBar.position = new Vector2(right - digits, 0);
                    this.objectUnderCursorSprite = new UIObjectSkin(this, npcUnderCursor.skin);
                    this.objectUnderCursorSprite.position = new Vector2(right, 0);
                }
            } else {
                this.remove(this.objectUnderCursorSprite!);
                this.remove(this.objectUnderCursorHealthBar!);
                this.objectUnderCursorSprite = null;
                this.objectUnderCursorHealthBar = null;
            }
        }

        const actionData = getNpcInteraction(this.npc);
        if (actionData) {
            actionData.object.highlighted = true;
            this.actionUnderCursor = new ObjectSkin(Grid.from([actionData.actionIcon]));
            this.remove(this.actionUnderCursorSprite!);
            this.actionUnderCursorSprite = new UIObjectSkin(this, this.actionUnderCursor);
            this.actionUnderCursorSprite.position = new Vector2(right, 0);
        } else {
            this.remove(this.actionUnderCursorSprite!);
            this.actionUnderCursorSprite = null;
        }
    }
}
