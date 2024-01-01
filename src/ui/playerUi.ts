import { drawCell, drawObjectAt } from "../engine/graphics/GraphicsEngine";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { Npc } from "../engine/objects/Npc";
import { Drawable, SceneObject } from "../engine/objects/SceneObject";
import { Scene } from "../engine/Scene";
import { Camera } from "../engine/Camera";

export class PlayerUi implements Drawable {
    objectUnderCursor: SceneObject | null = null;
    actionUnderCursor: Cell | null = null; 

    constructor(
        public npc: Npc,
        public camera: Camera) {
    }

    draw(ctx: CanvasContext) {
        const ui = this;
        // UI panel background.
        for (let i = 0; i < this.camera.size.width; i++) {
            drawCell(ctx, this.camera, new Cell(' ', 'white', '#000a', undefined, 15), i, 0);
        }

        if (!this.npc.mount) {
            drawObjectAt(ctx, this.camera, this.npc, [0, 0]);
        } else {
            drawObjectAt(ctx, this.camera, this.npc.mount, [0, 0]);
        }

        drawHealth(this.npc, [1, 0]);

        const right = this.camera.size.width - 1;
        if (this.objectUnderCursor) {
            if (this.objectUnderCursor instanceof Npc) {
                drawObjectAt(ctx, this.camera, this.objectUnderCursor, [right, 0]);
                drawHealth(this.objectUnderCursor, [right - this.objectUnderCursor.maxHealth, 0]);
            }
        } else if (this.actionUnderCursor) {
            drawCell(ctx, this.camera, this.actionUnderCursor, right, 0);
        }

        function drawHealth(npc: Npc, position: [number, number]) {
            for (let i = 0; i < npc.maxHealth; i++) {
                const heartCell = new Cell(`♥`, i <= npc.health ? 'red' : 'gray', 'transparent');
                drawCell(ctx, ui.camera, heartCell, position[0] + i, position[1]);
            }
        }
    }

    update(ticks: number, scene: Scene) {
        this.objectUnderCursor = null;
        this.actionUnderCursor = null;

        for (let o of scene.objects) {
            if (!o.enabled) continue;
            if (o instanceof Npc) {
                if (o.position[0] === this.npc.cursorPosition[0] 
                    && o.position[1] === this.npc.cursorPosition[1]) {
                        o.highlighted = true;
                        this.objectUnderCursor = o;
                        return;
                    }
            }
        }

        const actionData = scene.getNpcInteraction(this.npc);
        if (actionData) {
            actionData.object.highlighted = true;
            this.actionUnderCursor = actionData.actionIcon;
        }
    }
}