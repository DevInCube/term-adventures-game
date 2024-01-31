import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { HunterBehavior } from "../behaviors/HunterBehavior";
import { NpcMovementOptions, defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

class Wolf extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin().char(`🐺`), position);

        this.type = "wolf";
        this.movementOptions = <NpcMovementOptions>{
            ...defaultMovementOptions.walking,
            walkingSpeed: 5,
        };

        this.behaviors.push(new HunterBehavior({
            preyType: 'sheep',
        }));
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const wolf = this;
        //

        if (wolf.parameters["state"] === "feared") {
            wolf.skin.background('#FF000055');
        } else if (wolf.parameters["state"] === "hunting") {
            wolf.skin.background('violet');
        } else if (wolf.parameters["state"] === "wandering") {
            wolf.skin.background('yellow');
        } else {
            wolf.skin.background('transparent');
        }
    }
};

export function wolf(options: { position: [number, number] }) {
    return new Wolf(Vector2.from(options.position));
}
