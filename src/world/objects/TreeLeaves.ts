import { GameEvent } from "../../engine/events/GameEvent";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Sprite } from "../../engine/data/Sprite";
import { Object2D } from "../../engine/objects/Object2D";
import { Vector2 } from "../../engine/math/Vector2";
import { WeatherChangedGameEvent } from "../events/WeatherChangedGameEvent";
import { treeLeavesSprite } from "../sprites/treeLeaves";

export class TreeLeaves extends Object2D {
    private static sprite: Sprite = treeLeavesSprite;
    currentFrameName: string = "wind";
    isSnowy: boolean = false;
    constructor(
        position: Vector2) {
        super(
            Vector2.zero,
            TreeLeaves.sprite.frames["wind"][0],
            new ObjectPhysics(),
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
                this.skin = TreeLeaves.sprite.frames[this.currentFrameName][0];
            }
        }
    }

    handleEvent(ev: GameEvent) {
        super.handleEvent(ev);
        //
        const o = this;
        if (ev.type === 'wind_changed') {
            o.parameters["animate"] = ev.args["to"];
        } else if (ev.type === WeatherChangedGameEvent.type) {
            const args = <WeatherChangedGameEvent.Args>ev.args;
            this.isSnowy = args.to === 'snow';
        }
    }
};
