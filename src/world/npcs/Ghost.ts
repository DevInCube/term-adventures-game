import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";

export class Ghost extends Npc {
    constructor(position: [number, number]) {
        super(new ObjectSkin(`👻`), position);

        this.type = "ghost";
        this.realm = "soul";
        this.moveSpeed = 2;
        this.behaviors.push(new WanderingBehavior());
    }
}