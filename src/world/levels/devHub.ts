import { clone } from "../../utils/misc";
import { Level } from "../../engine/Level";
import { Door } from "../objects/Door";
import { fillLayer } from "../../utils/layer";

const door = new Door();
const doors = [
    clone(door, { position: [2, 2] }),
    clone(door, { position: [2, 4] }),
];

const objects = [...doors];
const level = new Level('devHub', objects);

fillLayer(level.wallsLayer, level.width, level.height, undefined);
if (true) {  // add walls
    for (let x = 0; x < 20; x++) {
        level.wallsLayer[0][x] = 1;
        level.wallsLayer[19][x] = 1;
    }
    for (let y = 1; y < 19; y++) {
        level.wallsLayer[y][0] = 1;
        level.wallsLayer[y][19] = 1;
    }
}

level.portals['lights'] = [[2, 2]];
level.portals['dungeon'] = [[2, 4]];
export const devHubLevel = level;