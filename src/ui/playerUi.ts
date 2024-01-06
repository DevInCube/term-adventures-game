import { drawCell, drawObjectAt } from "../engine/graphics/GraphicsEngine";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { Npc } from "../engine/objects/Npc";
import { Drawable, SceneObject } from "../engine/objects/SceneObject";
import { Scene } from "../engine/Scene";
import { Camera } from "../engine/Camera";
import { getNpcInteraction } from "../engine/ActionData";
import UIPanel from "./UIPanel";

export class PlayerUi implements Drawable {
    objectUnderCursor: SceneObject | null = null;
    actionUnderCursor: Cell | null = null; 
    heroHealthBar: HealthBarUi;
    objectUnderCursorHealthBar: HealthBarUi | null = null;
    panel: UIPanel;

    constructor(
        public npc: Npc,
        public camera: Camera) {

        this.panel = new UIPanel([0, 0], { width: camera.size.width, height: 1 });
        this.panel.borderColor = '#000a';
        this.heroHealthBar = new HealthBarUi(npc, [1, 0]);
    }

    draw(ctx: CanvasContext) {
        this.panel.draw(ctx);

        if (!this.npc.mount) {
            drawObjectAt(ctx, this.camera, this.npc, [0, 0], "ui");
        } else {
            drawObjectAt(ctx, this.camera, this.npc.mount, [0, 0], "ui");
        }

        this.heroHealthBar.draw(ctx);
        this.objectUnderCursorHealthBar?.draw(ctx);
        
        const right = this.camera.size.width - 1;
        if (this.objectUnderCursor) {
            if (this.objectUnderCursor instanceof Npc) {
                drawObjectAt(ctx, this.camera, this.objectUnderCursor, [right, 0], "ui");
            }
        } else if (this.actionUnderCursor) {
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
                this.objectUnderCursorHealthBar = new HealthBarUi(npcUnderCursor, [right - npcUnderCursor.maxHealth, 0]);
            }
        } else {
            this.objectUnderCursorHealthBar = null;
        }

        const actionData = getNpcInteraction(this.npc);
        if (actionData) {
            actionData.object.highlighted = true;
            this.actionUnderCursor = actionData.actionIcon;
        }
    }
}

class HealthBarUi implements Drawable {
    constructor(
        private npc: Npc,
        private position: [number, number]) {

    }

    draw(ctx: CanvasContext): void {
        for (let i = 0; i < this.npc.maxHealth; i++) {
            const heartCell = new Cell(`♥`, i <= this.npc.health ? 'red' : 'gray', 'transparent');
            drawCell(ctx, undefined, heartCell, this.position[0] + i, this.position[1], undefined, undefined, "ui");
        }
    }
}