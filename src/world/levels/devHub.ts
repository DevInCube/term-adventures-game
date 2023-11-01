import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { clone } from "../../utils/misc";
import { Level } from "../../engine/Level";
import { Door } from "../objects/Door";
import { house } from "../objects";

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

const house1 = clone(house, { position: [6, 2] });

const door = new Door();
const doors = [
    clone(door, { position: [2, 2] }),
    clone(door, { position: [2, 4] }),
    clone(door, { position: [6, 2] }),
];

const objects = [...fences, house1, ...doors];
const level = new Level('devHub', objects);
level.portals['lights'] = [[2, 2]];
level.portals['dungeon'] = [[2, 4]];
level.portals['house'] = [[6, 2]];
export const devHubLevel = level;