import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";

export class Bee extends Npc {
    type = "bee";
    maxHealth = 1;
    health = 1;

    constructor(position: [number, number]) {
        super(new ObjectSkin(`🐝`, `.`, {
            '.': ['yellow', 'transparent'],
        }), position);

        this.realm = "sky";
        this.behaviors.push(new WanderingBehavior());
    }
}

export function bee(options: { position: [number, number] }) {
    return new Bee(options.position);
}