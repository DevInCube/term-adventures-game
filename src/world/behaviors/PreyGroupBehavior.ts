import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { Object2D } from "../../engine/objects/Object2D";
import { GameEvent } from "../../engine/events/GameEvent";
import { WanderingBehavior } from "./WanderingBehavior";
import { FearBehavior } from "./FearBehavior";

export class PreyGroupBehavior implements Behavior {

    state: "feared" | "feared_2" | "still" | "wandering" = "still";
    stress: number = 0;

    fear;
    wander;

    constructor(public options: {
        enemiesRadius?: number,
        friendTypes: string[],
        friendsRadius?: number,
    }) {
        this.fear = new FearBehavior({
            enemyTypes: [],
            friendTypes: options.friendTypes,
            enemiesRadius: options.enemiesRadius,
        });
        this.wander = new WanderingBehavior();
    }

    update(ticks: number, object: Npc): void {
        this.fear.update(ticks, object);
        this.wander.update(ticks, object);

        const { enemies, stress } = this.getEnemiesAndStress();
        if (stress === 0) {
            this.wander.act(ticks, object);
        } else {
            object.runAway(enemies);
        }

        this.stress = stress;
        if (stress === 3) {
            this.state = "feared";
        } else if (stress === 0) {
            this.state = "wandering";
        } else {
            this.state = "feared_2";
        }

        object.parameters['stress'] = stress;
    }

    getEnemiesAndStress(): { enemies: Object2D[], stress: number } {
        if (this.fear.enemies.length) {
            return { enemies: this.fear.enemies, stress: 3 };
        } 
        
        if (this.fear.fearedFriends.length) { 
            const sheepsStress = Math.max(...this.fear.fearedFriends.map(x => x.parameters["stress"] | 0));
            const stress = sheepsStress - 1;
            if (this.stress > 0) {
                const enemies = this.fear.fearedFriends[0].parameters["enemies"] || this.fear.fearedFriends;
                return { enemies, stress };
            }
        } 

        return { enemies: [], stress: 0 };
    }

    act(ticks: number, object: Npc): void {
        
    }

    handleEvent(ev: GameEvent, object: Npc): void {
    }
}
