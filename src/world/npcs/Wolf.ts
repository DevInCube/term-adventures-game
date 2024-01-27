import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { HunterBehavior } from "../behaviors/HunterBehavior";
import { NpcMovementOptions, defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

class Wolf extends Npc {
    constructor(position: Vector2) {
        super(new ObjectSkin(`🐺`, `.`, {
            '.': [undefined, 'transparent'],
        }), position);

        this.type = "wolf";
        this.movementOptions = <NpcMovementOptions>{
            ...defaultMovementOptions.walking,
            walkingSpeed: 5,
        };

        this.behaviors.push(new HunterBehavior({
            preyType: 'sheep',
        }));
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const wolf = this;
        //

        if (wolf.parameters["state"] === "feared") {
            wolf.skin.setBackgroundAt([0, 0], '#FF000055');
        } else if (wolf.parameters["state"] === "hunting") {
            wolf.skin.setBackgroundAt([0, 0], 'violet');
        } else if (wolf.parameters["state"] === "wandering") {
            wolf.skin.setBackgroundAt([0, 0], 'yellow');
        } else {
            wolf.skin.setBackgroundAt([0, 0], 'transparent');
        }
    }
};

export function wolf(options: { position: [number, number] }) {
    return new Wolf(Vector2.from(options.position));
}
