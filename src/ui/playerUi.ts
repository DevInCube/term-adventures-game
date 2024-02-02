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

export class PlayerUi extends UIElement {
    objectUnderCursor: Object2D | null = null;
    actionUnderCursor: ObjectSkin | null = null;
    heroSprite: UISceneObject;
    heroHealthBar: HealthBarUi;
    objectUnderCursorSprite: UIObjectSkin | null = null;
    actionUnderCursorSprite: UIObjectSkin | null = null;
    objectUnderCursorHealthBar: HealthBarUi | null = null;
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
        for (let o of npcObjects) {
            if (o.position.equals(this.npc.cursorPosition)) {
                return o;
            }
        }

        return undefined;
    }

    update(ticks: number) {
        super.update(ticks);
        this.objectUnderCursor = null;
        this.actionUnderCursor = null;

        const right = this.camera.size.width - 1;

        if (this.npc.scene) {
            const npcUnderCursor = this.getNpcUnderCursor(this.npc.scene);
            if (npcUnderCursor) {
                if (npcUnderCursor !== this.objectUnderCursor) {
                    npcUnderCursor.highlighted = true;
                    this.objectUnderCursor = npcUnderCursor;

                    this.remove(this.objectUnderCursorSprite!);
                    this.remove(this.objectUnderCursorHealthBar!);
                    // TODO: this is re-created each tick, so they are not updated.
                    this.objectUnderCursorHealthBar = new HealthBarUi(this, npcUnderCursor);
                    this.objectUnderCursorHealthBar.position = new Vector2(right - npcUnderCursor.maxHealth, 0);
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
