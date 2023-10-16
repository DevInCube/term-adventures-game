import { GameEvent } from "../../engine/GameEvent";
import { Npc } from "../../engine/Npc";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { Campfire } from "../objects";

export class Wolf extends Npc {
    type = "wolf";
    moveSpeed = 4;

    constructor() {
        super(new ObjectSkin(`🐺`, `.`, {
            '.': [undefined, 'transparent'],
        }), [15, 15]);
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const wolf = this;
        wolf.direction = [0, 0];
        //
        const preyList = this.getMobsNearby(scene, 6, npc => npc.type === 'sheep');
        if (!wolf.parameters["target"] && preyList.length) {
            wolf.parameters["target"] = preyList[0];
        }

        const target = wolf.parameters["target"];
        const firesNearby = this.getObjectsNearby(scene, 5, x => x instanceof Campfire);
        if (firesNearby.length) {
            wolf.parameters["state"] = "feared";
            wolf.parameters["enemies"] = firesNearby;
            wolf.parameters["target"] = undefined;
        } else if (target) {
            wolf.parameters["state"] = "hunting";
        } else {
            wolf.parameters["state"] = "wandering";
        }

        if (wolf.parameters["state"] === "hunting") {
            if (wolf.distanceTo(target) <= 1) {
                wolf.attack(target);
            }
            wolf.approach(scene, target);
        }
        else if (wolf.parameters["state"] === "feared") {
            wolf.runAway(scene, firesNearby);
        }

        if (wolf.parameters["state"] === "feared") {
            wolf.skin.raw_colors[0][0] = [undefined, "#FF000055"];
        } else if (wolf.parameters["state"] === "hunting") {
            wolf.skin.raw_colors[0][0] = [undefined, "violet"];
        } else {
            wolf.skin.raw_colors[0][0] = [undefined, "transparent"];
        }
    }

    handleEvent(ev: GameEvent): void {
        super.handleEvent(ev);
        if (ev.type === "death" && ev.args.object === this.parameters["target"]) {
            this.parameters["target"] = null;
        }
    }
};