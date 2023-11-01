import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { clone } from "../../utils/misc";
import { Level } from "../../engine/Level";
import { Door } from "../objects/Door";
import { Campfire } from "../objects/Campfire";
import { fillLayer, forLayer } from "../../utils/layer";

const wallSkin = new ObjectSkin(` `, '.', { '.': ['transparent', '#666'] });
const physicsUnitBlocked = new ObjectPhysics('.');
const wall = new StaticGameObject([0, 0], wallSkin, physicsUnitBlocked, [0, 0]);

const walls: StaticGameObject[] = [];

if (true) {  // add border walls
    for (let x = 0; x < 20; x++) {
        walls.push(clone(wall, { position: [x, 0] }));
        walls.push(clone(wall, { position: [x, 19] }));
    }
    for (let y = 1; y < 19; y++) {
        walls.push(clone(wall, { position: [0, y] }));
        walls.push(clone(wall, { position: [19, y] }));
    }
}

if (true) {  // add random walls
    for (let y = 2; y < 17; y += 2) {
        const parts = 2;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            const newHeadStone = clone(wall, { position: [x, y] });
            walls.push(newHeadStone);
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

const objects = [...walls, ...doors, ...campfires];
const level = new Level('dungeon', objects);
level.roofLayer = [];
fillLayer(level.roofLayer, level.width, level.height, 15);
if (false) { // add test hole
    level.roofLayer[7][8] = 0;
    level.roofLayer[8][7] = 0;
    level.roofLayer[8][8] = 0;
    level.roofLayer[8][9] = 0;
    level.roofLayer[9][8] = 0;
}

if (true) { // add gradient
    forLayer(level.roofLayer, (l, x, y) => {
        const v = 8 + Math.sin(x / 2) * 8;
        l[y][x] = Math.min(15, Math.max(0, Math.round(v)));
    });
    console.log({roofLayer: level.roofLayer});
}

level.portals['dungeon'] = [[2, 2]];
export const dungeonLevel = level;