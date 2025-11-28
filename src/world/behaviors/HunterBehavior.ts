import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { Object2D } from "../../engine/objects/Object2D";
import { GameEvent } from "../../engine/events/GameEvent";
import { clamp } from "../../utils/math";

export class HunterBehavior implements Behavior {

    hungerTicks = 0;
    hunger = 3;
    target?: Npc;

    constructor(public options : {
        preyTypes: string[],
        preyRadius?: number,
    }) {

    }

    update(ticks: number, object: Npc): void {
        const scene = object.scene!;
        this.hungerTicks = Object2D.updateValue(this.hungerTicks, ticks, 2000, () => {
            this.hunger += 1;
        });
        //
        if (this.hunger >= 3) {
            const sightLightLevel = object.calculateSightLightLevel();
            const preyList = object.getObjectsNearby(
                scene,
                this.options?.preyRadius || 6,
                x => this.options.preyTypes.includes(x.type))
                .map(x => x as Npc)
                .filter(isPreyVisible);
            if (!preyList.length) {
                this.target = undefined;
            } else if (!this.target) {
                this.target = preyList[0];
            }

            function isPreyVisible(prey: Npc): boolean {
                const cloakLightLevel = prey.cloakLightLevel;
                const lightLevel = scene.lights.getLightInfoAt(prey.position)?.intensity ?? 0;
                return sightLightLevel >= clamp(cloakLightLevel - lightLevel, 0, 15);
            }
        }
    }

    act(ticks: number, object: Npc): void {
        if (!this.target) {
            return;
        }

        if (object.distanceTo(this.target) <= 1.0) {
            object.attack(this.target);
        }
        
        object.approach(this.target);
    }

    handleEvent(ev: GameEvent, object: Npc): void {
    }
}
