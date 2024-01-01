import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { MountBehavior } from "../behaviors/MountBehavior";

export class Deer extends Npc {
    constructor(position: [number, number]) {
        super(new ObjectSkin(`🦌`), position);

        this.type = "deer";
        this.moveSpeed = 10;
        this.behaviors.push(new MountBehavior(this));
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const deer = this;
        //
        // update skin
        if (deer.parameters["isMounted"]) {
            deer.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
        } else {
            deer.skin.raw_colors[0][0] = [undefined, "#FF00FF55"];
        }
    }
}

export function deer(options: { position: [number, number] }) {
    return new Deer(options.position);
}