import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { NpcMovementOptions } from "../../engine/objects/NpcMovementOptions";

export class Ghost extends Npc {
    constructor(position: [number, number]) {
        super(new ObjectSkin(`👻`), position);

        this.type = "ghost";
        this.realm = "soul";
        this.movementOptions = <NpcMovementOptions> {
            flyingSpeed: 4,
        };
        this.behaviors.push(new WanderingBehavior());
    }
}
