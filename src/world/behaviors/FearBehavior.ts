import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { Object2D } from "../../engine/objects/Object2D";
import { GameEvent } from "../../engine/events/GameEvent";

export class FearBehavior implements Behavior {

    enemies: Object2D[] = [];
    fearedFriends: Object2D[] = [];

    constructor(public options: {
        enemyTypes: string[];
        enemiesRadius?: number;
        friendTypes?: string[];
        friendsRadius?: number;
    }) {
    }

    update(ticks: number, object: Npc): void {
        const scene = object.scene!;
        const friendTypes = this.options.friendTypes; 

        this.enemies = object.getMobsNearby(scene, this.options?.enemiesRadius || 5, x => {
            if (typeof friendTypes !== "undefined" && friendTypes) {
                return !friendTypes.includes(x.type);
            }

            return this.options.enemyTypes.includes(x.type);
        });

        if (friendTypes) {
            this.fearedFriends = object.getMobsNearby(scene, this.options?.friendsRadius || 2, x => {
                return (
                    friendTypes.includes(x.type) && 
                    (x.parameters["stress"] | 0) > 0
                );
            });
        }
    }

    act(ticks: number, object: Npc): void {
        object.runAway(this.enemies);
    }

    handleEvent(ev: GameEvent, object: Npc): void {
    }
}
