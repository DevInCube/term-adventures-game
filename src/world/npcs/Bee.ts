import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";

export class Bee extends Npc {
    constructor(position: [number, number]) {
        super(new ObjectSkin(`🐝`, `.`, {
            '.': ['yellow', 'transparent'],
        }), position);

        this.type = "bee";
        this.realm = "sky";
        this.movementOptions = defaultMovementOptions.flying;
        this.behaviors.push(new WanderingBehavior());
    }
}

export function bee(options: { position: [number, number] }) {
    return new Bee(options.position);
}