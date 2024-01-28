import { Cell } from "../engine/graphics/Cell";
import { Npc } from "../engine/objects/Npc";
import { UIElement } from "./UIElement";
import { ObjectSkin } from "../engine/components/ObjectSkin";

export class HealthBarUi extends UIElement {
    constructor(
        parent: UIElement,
        private npc: Npc,
    ) {
        super(parent);
        this.skin = this.createSkin(this.npc);
    }

    update(ticks: number) {
        this.skin = this.createSkin(this.npc);
    }

    private createSkin(npc: Npc): ObjectSkin {
        const cells: Cell[] = [];
        for (let i = 0; i < npc.maxHealth; i++) {
            const heartCell = new Cell(`♥`, i <= npc.health ? 'red' : 'gray', 'transparent');
            cells.push(heartCell);
        }

        return new ObjectSkin([cells]);
    }
}
