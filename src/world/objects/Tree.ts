import { GameEvent } from "../../engine/GameEvent";
import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { Scene } from "../../engine/Scene";
import { Sprite } from "../../engine/SpriteLoader";
import { StaticGameObject } from "../../engine/StaticGameObject";

export abstract class Tree extends StaticGameObject {
    constructor(
        originPoint: [number, number],
        private sprite: Sprite,
        physics: ObjectPhysics,
        position: [number, number]) {
        super(
            originPoint,
            sprite.frames["wind"][0],
            physics,
            position);
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const o = this;
        if (o.ticks > 300) {
            o.ticks = 0;
            if (o.parameters["animate"]) {
                o.parameters["tick"] = !o.parameters["tick"];
                o.skin = o.parameters["tick"] 
                    ? this.sprite.frames['no wind'][0] 
                    : this.sprite.frames['wind'][0];
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
            // if (ev.args.to === 'snow') {
            //     o.skin.raw_colors[0][1][1] = 'white';
            //     o.skin.raw_colors[1][0][1] = 'white';
            //     o.skin.raw_colors[1][1][1] = '#ccc';
            //     o.skin.raw_colors[1][2][1] = '#ccc';
            // } else {
            //     o.skin.raw_colors[0][1][1] = '#0a0';
            //     o.skin.raw_colors[1][0][1] = '#0a0';
            //     o.skin.raw_colors[1][1][1] = '#080';
            //     o.skin.raw_colors[1][2][1] = '#080';
            // }
        }
    }
};
