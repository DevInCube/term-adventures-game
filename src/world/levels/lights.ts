import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { clone } from "../../utils/misc";
import { Campfire } from "../objects/Campfire";
import { Level } from "../../engine/Level";
import { PineTree } from "../objects/PineTree";

const vFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);
const hFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);

const fences: StaticGameObject[] = [];

if (true) {  // add fence
    for (let x = 1; x < 19; x++) {
        fences.push(clone(hFence, { position: [x, 1] }));
        fences.push(clone(hFence, { position: [x, 18] }));
    }
    for (let y = 2; y < 18; y++) {
        fences.push(clone(vFence, { position: [1, y] }));
        fences.push(clone(vFence, { position: [18, y] }));
    }
}


const headStone = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`🪦`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);
const headStones: StaticGameObject[] = [];

if (true) {  // random objects
    for (let y = 2; y < 17; y += 2) {
        const parts = 2;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            const newHeadStone = clone(headStone, { position: [x, y] });
            headStones.push(newHeadStone);
        }
    }
}

const tree2 = clone(new PineTree(), { position: [7, 9] });
const campfire = new Campfire();
const campfires = [
    clone(campfire, { position: [3, 3] }),
];

const objects = [...fences, tree2, ...campfires, ...headStones];
export const lightsLevel = new Level('lights', objects);