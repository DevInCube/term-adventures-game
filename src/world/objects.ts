import { StaticGameObject } from "./../engine/StaticGameObject";
import { ObjectSkin } from "../engine/ObjectSkin";
import { ObjectPhysics } from "../engine/ObjectPhysics";
import { GameEvent } from "../engine/GameEvent";
import { Scene } from "../engine/Scene";
import { clone } from "../utils/misc";
import { treeSprite } from "./sprites/tree";

export const house = new StaticGameObject([2, 2],
    new ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
        B: [undefined, 'black'],
        S: [undefined, '#004'],
        W: ["black", "darkred"],
        D: ["black", "saddlebrown"]
    }),
    new ObjectPhysics(`
 ... 
 . .`, ''), [5, 10]);

class Tree extends StaticGameObject {
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

export const tree = new Tree();

export const trees: StaticGameObject[] = [];

const bamboo = new StaticGameObject([0, 4],
    new ObjectSkin(`▄
█
█
█
█
█`, `T
H
L
H
L
D`, {
        // https://colorpalettes.net/color-palette-412/
        'T': ['#99bc20', 'transparent'],
        'L': ['#517201', 'transparent'],
        'H': ['#394902', 'transparent'],
        'D': ['#574512', 'transparent'],
    }), new ObjectPhysics(` 
 
 
 
 
.`, ``), [0, 0]);
if (true) {  // random trees
    for (let y = 6; y < 18; y++) {
        const x = (Math.random() * 8 + 1) | 0;
        trees.push(clone(bamboo, { position: [x, y] }));
        const x2 = (Math.random() * 8 + 8) | 0;
        trees.push(clone(bamboo, { position: [x2, y] }));
    }
    for (let tree of trees) {
        tree.setAction(0, 5, (obj) => {
            obj.enabled = false;
            // console.log("Cut tree"); @todo sent event
        });
    }
}

export const lamp = new StaticGameObject([0, 2],
    new ObjectSkin(`⬤
█
█`, `L
H
H`, {
        'L': ['yellow', 'transparent'],
        'H': ['#666', 'transparent'],
    }),
    new ObjectPhysics(` 
 
.`, `B`), [0, 0]);
lamp.parameters["is_on"] = true;
lamp.setAction(0, 2, (o) => {
    o.parameters["is_on"] = !o.parameters["is_on"];
    o.skin.raw_colors[0][0][0] = o.parameters["is_on"] ? 'yellow' : 'gray';
    o.physics.lights[0] = o.parameters["is_on"] ? 'B' : '0';
}, 0, 0);

export const chest = new StaticGameObject([0, 0], new ObjectSkin(`S`, `V`, {
    V: ['yellow', 'violet'],
}), new ObjectPhysics(`.`, ''), [2, 10]);

const flower = new StaticGameObject([0, 0], new ObjectSkin(`❁`, `V`, {
    V: ['red', 'transparent'],
}), new ObjectPhysics(` `, 'F'), [2, 10]);

export const flowers: StaticGameObject[] = [];
// for (let i = 0; i < 10; i++) {
//     const fl = clone(flower, {position: [Math.random() * 20 | 0, Math.random() * 20 | 0]});
//     flowers.push(fl);
//     fl.onUpdate((ticks, o, scene) => {
//         if (!o.parameters["inited"]) { 
//             o.parameters["inited"] = true;
//             o.skin.raw_colors[0][0][0] = ['red', 'yellow', 'violet'][(Math.random() * 3) | 0]
//         }
//     })
// }

class Campfire extends StaticGameObject {
    constructor() {
        super([0, 0], new ObjectSkin(`🔥`, `V`, {
            V: ['red', 'transparent'],
        }), new ObjectPhysics(` `, 'F', 'F'), [10, 10]);
    }

    new() { return new Campfire(); }

    handleEvent(ev: GameEvent) {
        super.handleEvent(ev);
        //
        if (ev.type === 'weather_changed') {
            if (ev.args["to"] == 'rain') {
                this.skin.grid[0][0] = `💨`;
                this.physics.lights[0] = `6`;
                this.physics.temperatures[0] = `8`;
            }
            else if (ev.args["to"] == 'rain_and_snow') {
                this.skin.grid[0][0] = `🔥`;
                this.physics.lights[0] = `A`;
                this.physics.temperatures[0] = `A`;
            }
            else {
                this.skin.grid[0][0] = `🔥`;
                this.physics.lights[0] = `F`;
                this.physics.temperatures[0] = `F`;
            }
        }
    }
}

export const campfire = new Campfire();