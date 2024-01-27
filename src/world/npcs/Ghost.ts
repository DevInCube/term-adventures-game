import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { NpcMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

export class Ghost extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin(`👻`), position);

        this.type = "ghost";
        this.realm = "soul";
        this.movementOptions = <NpcMovementOptions> {
            flyingSpeed: 4,
        };
        this.behaviors.push(new WanderingBehavior());
    }
}
