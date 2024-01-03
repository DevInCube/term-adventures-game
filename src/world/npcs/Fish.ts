import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";

export class Fish extends Npc {
    type = "fish";
    maxHealth = 1;
    health = 1;

    constructor(position: [number, number]) {
        super(new ObjectSkin(`🐟`), position);

        this.realm = "water";
        this.movementOptions = defaultMovementOptions.waterborne;
        this.behaviors.push(new WanderingBehavior())
    }
}
