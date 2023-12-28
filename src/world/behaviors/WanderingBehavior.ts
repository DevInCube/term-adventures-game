import { Npc } from "../../engine/objects/Npc";
import { Scene } from "../../engine/Scene";
import { Behavior } from "../../engine/objects/Behavior";
import { GameEvent } from "../../engine/events/GameEvent";

export class WanderingBehavior implements Behavior {

    constructor(public options: {} = {}) {
    }

    update(ticks: number, scene: Scene, object: Npc): void {
        object.direction = [0, 0];
        object.moveRandomly();

        if (!scene.isPositionBlocked(object.cursorPosition)) {
            object.move();
        }
    }

    handleEvent(ev: GameEvent, object: Npc): void {
    }
}
