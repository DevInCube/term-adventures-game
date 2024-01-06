import { drawCell } from "../engine/graphics/GraphicsEngine";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { Npc } from "../engine/objects/Npc";
import { SceneObject } from "../engine/objects/SceneObject";
import { Scene } from "../engine/Scene";
import { Camera } from "../engine/Camera";
import { getNpcInteraction } from "../engine/ActionData";
import { UIPanel } from "./UIPanel";
import { UIElement } from "./UIElement";
import { UISceneObject } from "./UISceneObject";
import { HealthBarUi } from "./HealthBarUi";

export class PlayerUi extends UIElement {
    objectUnderCursor: SceneObject | null = null;
    actionUnderCursor: Cell | null = null;
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

        this.panel = new UIPanel(this, [0, 0], { width: camera.size.width, height: 1 });
        this.panel.borderColor = '#000a';
        this.heroSprite = new UISceneObject(this, npc);
        this.heroSprite.position = [0, 0];
        this.heroHealthBar = new HealthBarUi(this, npc, [1, 0]);
    }

    draw(ctx: CanvasContext) {
        super.draw(ctx);

        const right = this.camera.size.width - 1;
        if (this.actionUnderCursor) {
            drawCell(ctx, this.camera, this.actionUnderCursor, right, 0, undefined, undefined, "ui");
        }
    }

    private getNpcUnderCursor(scene: Scene): Npc | undefined {
        const npcObjects = scene.objects
            .filter(x => x.enabled && x instanceof Npc)
            .map(x => x as Npc);
        for (let o of npcObjects) {
            if (o.position[0] === this.npc.cursorPosition[0] &&
                o.position[1] === this.npc.cursorPosition[1]) {
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
                this.objectUnderCursorHealthBar = new HealthBarUi(this, npcUnderCursor, [right - npcUnderCursor.maxHealth, 0]);
                this.objectUnderCursorSprite = new UISceneObject(this, npcUnderCursor);
                this.objectUnderCursorSprite.position = [right, 0];
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
