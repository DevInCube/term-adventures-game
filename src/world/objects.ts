import { StaticGameObject } from "../engine/objects/StaticGameObject";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { GameEvent } from "../engine/events/GameEvent";
import { clone } from "../utils/misc";
import { bamboo } from "./objects/Bamboo";

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

export const trees: StaticGameObject[] = [];

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