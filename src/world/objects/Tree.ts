import { GameEvent } from "../../engine/GameEvent";
import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { Scene } from "../../engine/Scene";
import { Sprite } from "../../engine/SpriteLoader";
import { StaticGameObject } from "../../engine/StaticGameObject";

export abstract class Tree extends StaticGameObject {
    currentFrameName: string = "wind";
    isSnowy: boolean = false;
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
                this.currentFrameName = o.parameters["tick"] 
                    ? 'no wind' 
                    : 'wind';
                this.skin = this.sprite.frames[this.currentFrameName][0];

                if (this.isSnowy) {
                    for (let y = 0; y < this.skin.grid.length; y++) {
                        for (let x = 0; x < this.skin.grid[0].length; x++) {
                            if (this.physics.tops[y] && this.physics.tops[y][x] !== ' ') {
                                this.skin.raw_colors[y][x][1] = 'white';
                            }
                        }
                    }
                }
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
