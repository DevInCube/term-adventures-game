import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { HunterBehavior } from "../behaviors/HunterBehavior";
import { NpcMovementOptions, defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";

class Wolf extends Npc {
    constructor(position: [number, number]) {
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
            wolf.skin.raw_colors[0][0] = [undefined, "#FF000055"];
        } else if (wolf.parameters["state"] === "hunting") {
            wolf.skin.raw_colors[0][0] = [undefined, "violet"];
        } else if (wolf.parameters["state"] === "wandering") {
            wolf.skin.raw_colors[0][0] = [undefined, "yellow"];
        } else {
            wolf.skin.raw_colors[0][0] = [undefined, "transparent"];
        }
    }
};

export function wolf(options: { position: [number, number] }) {
    return new Wolf(options.position);
}
