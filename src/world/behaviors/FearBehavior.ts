import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { Object2D } from "../../engine/objects/Object2D";
import { GameEvent } from "../../engine/events/GameEvent";

export class FearBehavior implements Behavior {

    enemies: Object2D[];

    constructor(public options: {
        enemyTypes: string[];
        enemiesRadius?: number;
    }) {
    }

    update(ticks: number, object: Npc): void {
        const scene = object.scene!;

        this.enemies = object.getObjectsNearby(scene, this.options?.enemiesRadius || 5, x => this.options.enemyTypes.includes(x.type));
    }

    handleEvent(ev: GameEvent, object: Npc): void {
    }
}
