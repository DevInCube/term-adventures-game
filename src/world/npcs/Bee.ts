import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

export class Bee extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkinBuilder(`🐝`, `.`, {
            '.': ['yellow', 'transparent'],
        }).build(), position);

        this.type = "bee";
        this.realm = "sky";
        this.movementOptions = defaultMovementOptions.flying;
        this.behaviors.push(new WanderingBehavior());
    }
}

export function bee(options: { position: [number, number] }) {
    return new Bee(Vector2.from(options.position));
}