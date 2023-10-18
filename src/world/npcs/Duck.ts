import { Npc } from "../../engine/Npc";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { Scene } from "../../engine/Scene";

// TODO: behavior
// Likes to wander and stay in water, has good speed in water
export class Duck extends Npc {
    type = "duck";
    maxHealth = 1;
    health = 1;

    constructor() {
        super(new ObjectSkin(`🦆`, `.`, {
            '.': [undefined, 'transparent'],
        }), [0, 0]);
    }

    new() {
        return new Duck();
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const duck = this;
        const state = duck.parameters["state"];
        duck.direction = [0, 0];
        // TODO: move fear and flee logic to some behavior class.
        let enemiesNearby = this.getMobsNearby(scene, 5, x => x.type !== 'duck');
        const fearedDucks = this.getMobsNearby(scene, 2, x => x.type === "duck" && (x.parameters["stress"] | 0) > 0);
        if (enemiesNearby.length || fearedDucks.length) {
            if (enemiesNearby.length) {
                duck.parameters["state"] = "feared";
                duck.parameters["stress"] = 3;
                duck.parameters["enemies"] = enemiesNearby;
            } else {
                const duckStress = Math.max(...fearedDucks.map(x => x.parameters["stress"] | 0));
                duck.parameters["stress"] = duckStress - 1;
                if (duck.parameters["stress"] === 0) {
                    duck.parameters["state"] = "still";
                    duck.parameters["enemies"] = [];
                } else {
                    duck.parameters["state"] = "feared_2";
                    duck.parameters["enemies"] = fearedDucks[0].parameters["enemies"];
                    enemiesNearby = fearedDucks[0].parameters["enemies"];
                }
            }

        } else {
            duck.parameters["state"] = "wandering";
            duck.parameters["stress"] = 0;
            duck.parameters["enemies"] = [];
        }

        if (state === "wandering") {
            this.moveRandomly();
        }

        if (!scene.isPositionBlocked(duck.cursorPosition)) {
            duck.move();
        } else if (duck.parameters["stress"] > 0) {
            this.runAway(scene, enemiesNearby);
        }

        if (duck.parameters["state"] === "feared") {
            duck.skin.raw_colors[0][0] = [undefined, "#FF000055"];
        } else if (duck.parameters["stress"] > 1) {
            duck.skin.raw_colors[0][0] = [undefined, "#FF8C0055"];
        } else if (duck.parameters["stress"] > 0) {
            duck.skin.raw_colors[0][0] = [undefined, "#FFFF0055"];
        } else {
            duck.skin.raw_colors[0][0] = [undefined, "transparent"];
        }
    }
}