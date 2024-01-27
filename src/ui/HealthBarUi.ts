import { drawCell } from "../engine/graphics/GraphicsEngine";
import { CanvasContext } from "../engine/graphics/CanvasContext";
import { Cell } from "../engine/graphics/Cell";
import { Npc } from "../engine/objects/Npc";
import { UIElement } from "./UIElement";
import { Vector2 } from "../engine/math/Vector2";

export class HealthBarUi extends UIElement {
    constructor(
        parent: UIElement,
        private npc: Npc,
        position: Vector2
    ) {
        super(parent);
        this.position = position;
    }

    draw(ctx: CanvasContext): void {
        for (let i = 0; i < this.npc.maxHealth; i++) {
            const heartCell = new Cell(`♥`, i <= this.npc.health ? 'red' : 'gray', 'transparent');
            drawCell(ctx, undefined, heartCell, this.position.clone().add(new Vector2(i, 0)), undefined, undefined, "ui");
        }
    }
}
