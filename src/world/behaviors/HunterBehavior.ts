import { Npc } from "../../engine/objects/Npc";
import { Scene } from "../../engine/Scene";
import { Campfire } from "../objects/Campfire";
import { Behavior } from "../../engine/objects/Behavior";
import { SceneObject } from "../../engine/objects/SceneObject";
import { GameEvent } from "../../engine/events/GameEvent";

export class HunterBehavior implements Behavior {

    hungerTicks = 0;
    hunger = 3;
    state: "wandering" | "hunting" | "feared" | "still" = "still";
    target?: Npc;
    enemies: SceneObject[];

    constructor(public options : {
        preyType: string,
        preyRadius?: number,
        enemiesRadius?: number,
        randomMoveKoef?: number,
    }) {

    }

    new() {
        return new HunterBehavior(this.options);
    }

    update(ticks: number, scene: Scene, object: Npc): void {
        
        this.hungerTicks += ticks;

        object.direction = [0, 0];

        if (this.hungerTicks > 2000) {
            this.hunger += 1;
            this.hungerTicks = 0;
        }
        //
        if (this.hunger >= 3) {
            const preyList = object.getMobsNearby(scene, this.options?.preyRadius || 6, npc => npc.type === this.options.preyType);
            if (!preyList.length) {
                this.state = "wandering";
            } else if (!this.target) {
                this.target = preyList[0];
                this.state = "hunting";
            }
        }

        const enemiesNearby = object.getObjectsNearby(scene, this.options?.enemiesRadius || 5, x => x instanceof Campfire); // TODO: static object typing.
        if (enemiesNearby.length) {
            this.state = "feared";
            this.enemies = enemiesNearby;
            this.target = undefined;
        }

        if (this.state === "hunting" && this.target) {
            if (object.distanceTo(this.target) <= 1) {
                object.attack(this.target);
            }
            object.approach(scene, this.target);
        } else if (this.state === "feared") {
            object.runAway(scene, enemiesNearby);
        } else if (this.state === "wandering") {
            object.moveRandomly(this.options?.randomMoveKoef || 10);
            if (!scene.isPositionBlocked(object.cursorPosition)) {
                object.move();
            }
        }

        object.parameters['state'] = this.state;
    }

    handleEvent(ev: GameEvent, object: Npc): void {
        if (ev.type === "death" && ev.args.object === this.target) {
            this.target = undefined;
            if (ev.args.cause.type === "attacked" && ev.args.cause.by === object) {
                this.hunger = 0;
                this.state = "still";
            }
        }
    }
}
