import { drawCell, drawObjects, drawObjectAt, CanvasContext } from "../engine/GraphicsEngine";
import { Cell } from "../engine/Cell";
import { viewWidth } from "../main";
import { Npc } from "../engine/Npc";
import { createTextObject } from "../utils/misc";
import { Drawable, SceneObject } from "../engine/SceneObject";
import { Scene } from "../engine/Scene";

export class PlayerUi implements Drawable {
    objectUnderCursor: SceneObject | null = null;
    actionUnderCursor: Cell | null = null; 

    constructor(public npc: Npc) {
    }

    draw(ctx: CanvasContext) {
        // UI panel background.
        for (let i = 0; i < viewWidth; i++) {
            drawCell(ctx, new Cell(' ', 'white', 'black'), i, 0);
        }

        drawHealth(this.npc, [0, 0]);

        const right = viewWidth - 1;
        if (this.objectUnderCursor) {
            if (this.objectUnderCursor instanceof Npc) {
                drawObjectAt(ctx, this.objectUnderCursor, [right, 0]);
                drawHealth(this.objectUnderCursor, [right - this.objectUnderCursor.maxHealth, 0]);
            }
        } else if (this.actionUnderCursor) {
            drawCell(ctx, this.actionUnderCursor, right, 0);
        }

        function drawHealth(npc: Npc, position: [number, number]) {
            for (let i = 0; i < npc.maxHealth; i++) {
                const heartCell = new Cell(`♥`, i <= npc.health ? 'red' : 'gray', 'transparent');
                drawCell(ctx, heartCell, position[0] + i, position[1]);
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

        const actionData = scene.getNpcAction(this.npc);
        if (actionData) {
            actionData.object.highlighted = true;
            this.actionUnderCursor = actionData.actionIcon;
        }
    }
}