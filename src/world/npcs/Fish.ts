import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";

export class Fish extends Npc {
    type = "fish";
    maxHealth = 1;
    health = 1;

    constructor(position: [number, number]) {
        super(new ObjectSkin(`🐟`), position);

        this.realm = "water";
        this.moveSpeed = 0;
        this.behaviors.push(new WanderingBehavior())
    }
}
