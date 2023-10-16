import { GameEvent } from "../../engine/GameEvent";
import { Npc } from "../../engine/Npc";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { Scene } from "../../engine/Scene";

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
        const prayList = getPrayNearby(this, 6);
        if (!wolf.parameters["target"] && prayList.length) {
            wolf.parameters["target"] = prayList[0];
        }
        const target = wolf.parameters["target"];
        if (target) {
            if (wolf.distanceTo(target) <= 1) {
                wolf.attack(target);
            }
            wolf.approach(scene, target);
        }

        function getPrayNearby(self: Npc, radius: number) {
            const enemies = [];
            for (const object of scene.objects) {
                if (!object.enabled) continue;
                if (object === self) continue;  // self check
                if (object instanceof Npc && object.type === "sheep") {
                    if (wolf.distanceTo(object) < radius) {
                        enemies.push(object);
                    }
                }
            }
            return enemies;
        }
    }

    handleEvent(ev: GameEvent): void {
        super.handleEvent(ev);
        if (ev.type === "death" && ev.args.object === this.parameters["target"]) {
            this.parameters["target"] = null;
        }
    }
};