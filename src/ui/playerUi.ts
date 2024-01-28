import { drawCell } from "../engine/graphics/GraphicsEngine";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { Npc } from "../engine/objects/Npc";
import { Object2D } from "../engine/objects/Object2D";
import { Scene } from "../engine/Scene";
import { Camera } from "../engine/Camera";
import { getNpcInteraction } from "../engine/ActionData";
import { UIPanel } from "./UIPanel";
import { UIElement } from "./UIElement";
import { UISceneObject } from "./UISceneObject";
import { HealthBarUi } from "./HealthBarUi";
import { Vector2 } from "../engine/math/Vector2";

export class PlayerUi extends UIElement {
    objectUnderCursor: Object2D | null = null;
    actionUnderCursor: Cell[] | null = null;
    heroSprite: UISceneObject;
    heroHealthBar: HealthBarUi;
    objectUnderCursorSprite: UISceneObject | null = null;
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
        this.heroHealthBar = new HealthBarUi(this, npc, new Vector2(1, 0));
    }

    draw(ctx: CanvasContext) {
        super.draw(ctx);

        const right = this.camera.size.width - 1;
        for (const cell of this.actionUnderCursor || []) {
            drawCell(ctx, this.camera, cell, new Vector2(right, 0), undefined, undefined, "ui");
        }
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

    update(ticks: number, scene: Scene) {
        this.objectUnderCursor = null;
        this.actionUnderCursor = null;

        const npcUnderCursor = this.getNpcUnderCursor(scene);
        if (npcUnderCursor) {
            if (npcUnderCursor !== this.objectUnderCursor) {
                npcUnderCursor.highlighted = true;
                this.objectUnderCursor = npcUnderCursor;

                const right = this.camera.size.width - 1;
                this.remove(this.objectUnderCursorSprite);
                this.remove(this.objectUnderCursorHealthBar);
                this.objectUnderCursorHealthBar = new HealthBarUi(this, npcUnderCursor, new Vector2(right - npcUnderCursor.maxHealth, 0));
                this.objectUnderCursorSprite = new UISceneObject(this, npcUnderCursor);
                this.objectUnderCursorSprite.position = new Vector2(right, 0);
            }
        } else {
            this.remove(this.objectUnderCursorSprite);
            this.remove(this.objectUnderCursorHealthBar);
            this.objectUnderCursorSprite = null;
            this.objectUnderCursorHealthBar = null;
        }

        const actionData = getNpcInteraction(this.npc);
        if (actionData) {
            actionData.object.highlighted = true;
            this.actionUnderCursor = actionData.actionIcon;
        }
    }
}
