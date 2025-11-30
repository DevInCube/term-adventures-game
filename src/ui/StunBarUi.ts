import { Npc } from "../engine/objects/Npc";
import { UIElement } from "./UIElement";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { createTextObjectSkin } from "../utils/misc";

export class StunBarUi extends UIElement {
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
        return createTextObjectSkin((npc.stunValue | 0).toString() + "/" + npc.maxStunValue.toString());
    }
}
