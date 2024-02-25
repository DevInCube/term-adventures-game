import { GameEvent } from "../../engine/events/GameEvent";
import { Object2D } from "../../engine/objects/Object2D";

export namespace DamageGameEvent {
    export const type = "damage";

    export class Args {
        object: Object2D;
        subject: Object2D;
        damageValue: number;
        damageType: string;
    }

    export function create(object: Object2D, subject: Object2D, damageValue: number, damageType: string) {
        return new GameEvent(
            object,
            DamageGameEvent.type,
            <DamageGameEvent.Args>{
                object,
                subject,
                damageValue,
                damageType,
            });
    }
}
