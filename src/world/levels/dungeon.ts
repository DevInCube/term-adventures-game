import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { clone } from "../../utils/misc";
import { Level } from "../../engine/Level";
import { Door } from "../objects/Door";
import { Campfire } from "../objects/Campfire";
import { fillLayer, forLayer } from "../../utils/layer";

const campfire = new Campfire();
const campfires = [
    clone(campfire, { position: [3, 3] }),
    clone(campfire, { position: [13, 13] }),
];

const door = new Door();
const doors = [
    clone(door, { position: [2, 2] }),
];

const objects = [...doors, ...campfires];
const level = new Level('dungeon', objects);

fillLayer(level.wallsLayer, level.width, level.height, undefined);
if (true) {  // add border walls
    for (let x = 0; x < 20; x++) {
        level.wallsLayer[0][x] = 1;
        level.wallsLayer[19][x] = 1;
    }
    for (let y = 1; y < 19; y++) {
        level.wallsLayer[y][0] = 1;
        level.wallsLayer[y][19] = 1;
    }
}

if (true) {  // add random walls
    for (let y = 2; y < 17; y += 2) {
        const parts = 2;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            level.wallsLayer[y][x] = 1;
        }
    }
}

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