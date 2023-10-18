import { GameEvent } from "../../engine/GameEvent";
import { Npc } from "../../engine/Npc";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { Campfire } from "../objects/Campfire";

export class Wolf extends Npc {
    type = "wolf";
    moveSpeed = 4;
    hungerTicks = 0;

    constructor() {
        super(new ObjectSkin(`🐺`, `.`, {
            '.': [undefined, 'transparent'],
        }), [15, 15]);

        this.parameters["hunger"] = 3;
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const wolf = this;
        wolf.direction = [0, 0];
        //
        wolf.hungerTicks += ticks;
        if (wolf.hungerTicks > 2000) {
            wolf.parameters["hunger"] += 1;
            wolf.hungerTicks = 0;
        }
        //
        if (wolf.parameters["hunger"] >= 3) {
            const preyList = this.getMobsNearby(scene, 6, npc => npc.type === 'sheep');
            if (!preyList.length) {
                wolf.parameters["state"] = "wandering";
            } else if (!wolf.parameters["target"]) {
                wolf.parameters["target"] = preyList[0];
                wolf.parameters["state"] = "hunting";
            }
        }

        const target = wolf.parameters["target"];
        const firesNearby = this.getObjectsNearby(scene, 5, x => x instanceof Campfire); // TODO: static object typing.
        if (firesNearby.length) {
            wolf.parameters["state"] = "feared";
            wolf.parameters["enemies"] = firesNearby;
            wolf.parameters["target"] = undefined;
        }

        if (wolf.parameters["state"] === "hunting") {
            if (wolf.distanceTo(target) <= 1) {
                wolf.attack(target);
            }
            wolf.approach(scene, target);
        } else if (wolf.parameters["state"] === "feared") {
            wolf.runAway(scene, firesNearby);
        } else if (wolf.parameters["state"] === "wandering") {
            wolf.moveRandomly(10);
            if (!scene.isPositionBlocked(wolf.cursorPosition)) {
                wolf.move();
            }
        }

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

    handleEvent(ev: GameEvent): void {
        super.handleEvent(ev);
        if (ev.type === "death" && ev.args.object === this.parameters["target"]) {
            this.parameters["target"] = null;
            if (ev.args.cause.type === "attacked" && ev.args.cause.by === this) {
                this.parameters["hunger"] = 0;
                this.parameters["state"] = "still";
            }
        }
    }
};