import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

export class Fish extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkinBuilder(`🐟`).build(), position);

        this.type = "fish";
        this.realm = "water";
        this.movementOptions = defaultMovementOptions.waterborne;
        this.behaviors.push(new WanderingBehavior())
    }
}
