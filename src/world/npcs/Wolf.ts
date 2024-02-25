import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { HunterBehavior } from "../behaviors/HunterBehavior";
import { NpcMovementOptions, defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";

export class Wolf extends Npc {
    constructor() {
        super(new ObjectSkin().char(`🐺`));

        this.type = "wolf";
        this.movementOptions = <NpcMovementOptions>{
            ...defaultMovementOptions.walking,
            walkingSpeed: 5,
        };

        this.behaviors.push(new HunterBehavior({
            preyTypes: ['sheep', 'human'],
            enemyTypes: ['campfire'],
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
    const position = Vector2.from(options.position)
    return new Wolf().translateX(position.x).translateY(position.y);
}
