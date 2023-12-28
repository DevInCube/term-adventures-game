import { Npc } from "../../engine/objects/Npc";
import { Scene } from "../../engine/Scene";
import { Behavior } from "../../engine/objects/Behavior";
import { SceneObject } from "../../engine/objects/SceneObject";
import { GameEvent } from "../../engine/events/GameEvent";
import { WanderingBehavior } from "./WanderingBehavior";

export class PreyGroupBehavior implements Behavior {

    state: "feared" | "feared_2" | "still" | "wandering" = "still";
    stress: number = 0;
    enemies: SceneObject[] = [];
    wanderingBeh: WanderingBehavior = new WanderingBehavior();

    constructor(public options: {
        enemiesRadius?: number,
        friendsRadius?: number,
    } = {}) {
    }

    update(ticks: number, object: Npc): void {
        const scene = object.scene!;
        let enemiesNearby = object.getMobsNearby(scene, this.options?.enemiesRadius || 5, x => x.type !== object.type);
        const fearedFriends = object.getMobsNearby(scene, this.options?.friendsRadius || 2, x => x.type === object.type && (x.parameters["stress"] | 0) > 0);
        if (enemiesNearby.length || fearedFriends.length) {
            if (enemiesNearby.length) {
                this.state = "feared";
                this.stress = 3;
                this.enemies = enemiesNearby;
            } else { 
                const sheepsStress = Math.max(...fearedFriends.map(x => x.parameters["stress"] | 0));
                this.stress = sheepsStress - 1;
                if (this.stress === 0) {
                    this.state = "still";
                    this.enemies = [];
                } else {
                    this.state = "feared_2";
                    this.enemies = fearedFriends[0].parameters["enemies"];
                    enemiesNearby = fearedFriends[0].parameters["enemies"];
                }
            }

        } else {
            this.state = "wandering";
            this.stress = 0;
            this.enemies = [];
        }

        const state = this.state;
        if (state === "wandering") {
            this.wanderingBeh.update(ticks, object);
        }

        if (this.stress > 0 && enemiesNearby) {
            object.runAway(scene, enemiesNearby);
        }

        object.parameters['stress'] = this.stress;
    }

    handleEvent(ev: GameEvent, object: Npc): void {
    }
}
