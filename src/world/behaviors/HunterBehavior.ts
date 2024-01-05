import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { SceneObject } from "../../engine/objects/SceneObject";
import { GameEvent } from "../../engine/events/GameEvent";
import { WanderingBehavior } from "./WanderingBehavior";

export class HunterBehavior implements Behavior {

    hungerTicks = 0;
    hunger = 3;
    state: "wandering" | "hunting" | "feared" | "still" = "still";
    target?: Npc;
    enemies: SceneObject[];
    wanderingBeh: WanderingBehavior = new WanderingBehavior();

    constructor(public options : {
        preyType: string,
        preyRadius?: number,
        enemiesRadius?: number,
        randomMoveKoef?: number,
    }) {

    }

    update(ticks: number, object: Npc): void {
        const scene = object.scene!;
        this.hungerTicks += ticks;

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

        const enemiesNearby = object.getObjectsNearby(scene, this.options?.enemiesRadius || 5, x => x.type === "campfire");
        if (enemiesNearby.length) {
            this.state = "feared";
            this.enemies = enemiesNearby;
            this.target = undefined;
        }

        if (this.state === "hunting" && this.target) {
            if (object.distanceTo(this.target) <= 1) {
                object.attack(this.target);
            }
            
            object.approach(this.target);
        } else if (this.state === "feared") {
            object.runAway(enemiesNearby);
        } else if (this.state === "wandering") {
            this.wanderingBeh.update(ticks, object);
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
