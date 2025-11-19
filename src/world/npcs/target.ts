import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Vector2 } from "../../engine/math/Vector2";

export class Target extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin().char(`🎯`), position);

        this.type = "target";
        this.realm = "ground";
        this.health = 99;
        this.maxHealth = 99;
    }
}

export function target(options: { position: [number, number] }) {
    return new Target(Vector2.from(options.position));
}