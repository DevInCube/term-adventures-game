import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { clone } from "../../utils/misc";
import { Level } from "../../engine/Level";
import { Door } from "../objects/Door";
import { Campfire } from "../objects/Campfire";

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
    for (let x = 0; x < 20; x++) {
        fences.push(clone(hFence, { position: [x, 0] }));
        fences.push(clone(hFence, { position: [x, 19] }));
    }
    for (let y = 1; y < 19; y++) {
        fences.push(clone(vFence, { position: [0, y] }));
        fences.push(clone(vFence, { position: [19, y] }));
    }
}

const pillar = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);
const pillars: StaticGameObject[] = [];

if (true) {  // random objects
    for (let y = 2; y < 17; y += 2) {
        const parts = 2;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            const newHeadStone = clone(pillar, { position: [x, y] });
            pillars.push(newHeadStone);
        }
    }
}

const campfire = new Campfire();
const campfires = [
    clone(campfire, { position: [3, 3] }),
    clone(campfire, { position: [13, 13] }),
];

const door = new Door();
const doors = [
    clone(door, { position: [2, 2] }),
];

const objects = [...fences, ...doors, ...pillars, ...campfires];
const level = new Level('dungeon', objects);
level.hasSky = false;
level.portals['dungeon'] = [[2, 2]];
export const dungeonLevel = level;