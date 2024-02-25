import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { Object2D } from "../../engine/objects/Object2D";
import { GameEvent } from "../../engine/events/GameEvent";
import { WanderingBehavior } from "./WanderingBehavior";

export class HunterBehavior implements Behavior {

    hungerTicks = 0;
    hunger = 3;
    state: "wandering" | "hunting" | "feared" | "still" = "still";
    target?: Npc;
    enemies: Object2D[];
    wanderingBeh: WanderingBehavior = new WanderingBehavior();

    constructor(public options : {
        preyTypes: string[],
        preyRadius?: number,
        enemyTypes: string[],
        enemiesRadius?: number,
        randomMoveKoef?: number,
    }) {

    }

    update(ticks: number, object: Npc): void {
        const scene = object.scene!;
        this.hungerTicks = Object2D.updateValue(this.hungerTicks, ticks, 2000, () => {
            this.hunger += 1;
        });
        //
        if (this.hunger >= 3) {
            const preyList = object.getObjectsNearby(scene, this.options?.preyRadius || 6, x => this.options.preyTypes.includes(x.type));
            if (!preyList.length) {
                this.state = "wandering";
            } else if (!this.target) {
                this.target = preyList[0] as Npc;
                this.state = "hunting";
            }
        }

        const enemiesNearby = object.getObjectsNearby(scene, this.options?.enemiesRadius || 5, x => this.options.enemyTypes.includes(x.type));
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
