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

const windowHorizontalSkin = new ObjectSkin(`🪟`, '.', { '.': ['blue', 'transparent'] });
const wallSkin = new ObjectSkin(` `, '.', { '.': ['transparent', '#666'] });
const physicsUnitBlockedTransparent = new ObjectPhysics('.', '', '', '', '0');
const physicsUnitBlockedTransparent2 = new ObjectPhysics('.', '', '', '', '3');
const physicsUnitBlockedTransparent3 = new ObjectPhysics('.', '', '', '', '6');
const physicsUnitBlocked = new ObjectPhysics('.');
const windowHorizontal = new StaticGameObject([0, 0], windowHorizontalSkin, physicsUnitBlockedTransparent);
const wall = new StaticGameObject([0, 0], wallSkin, physicsUnitBlocked);

const walls: StaticGameObject[] = [];

walls.push(clone(wall, { position: [5, 3]}));
walls.push(clone(wall, { position: [9, 3]}));
walls.push(clone(wall, { position: [13, 3]}));
//
walls.push(clone(wall, { position: [4, 4]}));
walls.push(clone(wall, { position: [6, 4]}));
walls.push(clone(wall, { position: [8, 4]}));
walls.push(clone(wall, { position: [10, 4]}));
walls.push(clone(wall, { position: [12, 4]}));
walls.push(clone(wall, { position: [14, 4]}));
//
walls.push(clone(wall, { position: [4, 5]}));
walls.push(clone(windowHorizontal, { position: [5, 5]}));
walls.push(clone(wall, { position: [6, 5]}));
walls.push(clone(wall, { position: [8, 5]}));
walls.push(clone(windowHorizontal, { position: [9, 5], physics: physicsUnitBlockedTransparent2}));
walls.push(clone(wall, { position: [10, 5]}));
walls.push(clone(wall, { position: [12, 5]}));
walls.push(clone(windowHorizontal, { position: [13, 5], physics: physicsUnitBlockedTransparent3}));
walls.push(clone(wall, { position: [14, 5]}));

if (true) {  // random objects
    for (let y = 8; y < 17; y += 2) {
        const parts = 2;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            const newHeadStone = clone(headStone, { position: [x, y] });
            headStones.push(newHeadStone);
        }
    }
}

const tree2 = clone(new PineTree(), { position: [7, 12] });
const campfire = new Campfire();
const campfires = [
    clone(campfire, { position: [5, 4] }),
    clone(campfire, { position: [9, 4] }),
    clone(campfire, { position: [13, 4] }),
    //
    clone(campfire, { position: [3, 17] }),
];

const objects = [...fences, ...walls, tree2, ...campfires, ...headStones];
const level = new Level('lights', objects);
level.portals['lights'] = [[7, 12]];
export const lightsLevel = level;