import { GameEvent } from "../../engine/GameEvent";
import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { StaticGameObject } from "../../engine/StaticGameObject";
import { treeSprite } from "../sprites/tree";

export class Tree extends StaticGameObject {
    constructor() {
        super([1, 3],
            treeSprite.frames['no wind'][0],
            new ObjectPhysics(`


 .`, ''), [2, 12]);
    }

    new() { return new Tree(); }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const o = this;
        if (o.ticks > 300) {
            o.ticks = 0;
            if (o.parameters["animate"]) {
                o.parameters["tick"] = !o.parameters["tick"];
                o.skin = o.parameters["tick"] 
                    ? treeSprite.frames['no wind'][0] 
                    : treeSprite.frames['wind'][0];
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
            if (ev.args.to === 'snow') {
                o.skin.raw_colors[0][1][1] = 'white';
                o.skin.raw_colors[1][0][1] = 'white';
                o.skin.raw_colors[1][1][1] = '#ccc';
                o.skin.raw_colors[1][2][1] = '#ccc';
            } else {
                o.skin.raw_colors[0][1][1] = '#0a0';
                o.skin.raw_colors[1][0][1] = '#0a0';
                o.skin.raw_colors[1][1][1] = '#080';
                o.skin.raw_colors[1][2][1] = '#080';
            }
        }
    }
};
