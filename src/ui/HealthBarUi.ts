import { drawCell } from "../engine/graphics/GraphicsEngine";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { Npc } from "../engine/objects/Npc";
import { UIElement } from "./UIElement";

export class HealthBarUi extends UIElement {
    constructor(
        parent: UIElement,
        private npc: Npc,
        position: [number, number]
    ) {
        super(parent);
        this.position = position;
    }

    draw(ctx: CanvasContext): void {
        for (let i = 0; i < this.npc.maxHealth; i++) {
            const heartCell = new Cell(`♥`, i <= this.npc.health ? 'red' : 'gray', 'transparent');
            drawCell(ctx, undefined, heartCell, this.position[0] + i, this.position[1], undefined, undefined, "ui");
        }
    }
}
