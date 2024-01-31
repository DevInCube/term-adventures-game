import { GameEvent } from "../../engine/events/GameEvent";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Sprite } from "../../engine/data/Sprite";
import { Object2D } from "../../engine/objects/Object2D";
import { Vector2 } from "../../engine/math/Vector2";

export abstract class Tree extends Object2D {
    currentFrameName: string = "wind";
    isSnowy: boolean = false;
    constructor(
        originPoint: Vector2,
        private sprite: Sprite,
        physics: ObjectPhysics,
        position: Vector2) {
        super(
            originPoint,
            sprite.frames["wind"][0],
            physics,
            position);
    }

    update(ticks: number) {
        super.update(ticks);
        //
        const o = this;
        if (o.ticks > 300) {
            o.ticks = 0;
            if (o.parameters["animate"]) {
                o.parameters["tick"] = !o.parameters["tick"];
                this.currentFrameName = o.parameters["tick"] 
                    ? 'no wind' 
                    : 'wind';
                this.skin = this.sprite.frames[this.currentFrameName][0];
            }
        }
    }

    handleEvent(ev: GameEvent) {
        super.handleEvent(ev);
        //
        const o = this;
        if (ev.type === 'wind_changed') {
            o.parameters["animate"] = ev.args["to"];
        } else if (ev.type === 'weather_changed') {
            this.isSnowy = ev.args.to === 'snow';
        }
    }
};
