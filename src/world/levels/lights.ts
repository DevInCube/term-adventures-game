import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { campfire } from "../objects/campfire";
import { Level } from "../../engine/Level";
import { pineTree } from "../objects/pineTree";
import { fence } from "../objects/fence";
import { headStone } from "../objects/headStone";
import { wall, windowHorizontal } from "../objects/house";
import { Tiles } from "../../engine/data/Tiles";
import { Door } from "../objects/door";

const fences: StaticGameObject[] = [];

if (true) {  // add fence
    for (let x = 1; x < 19; x++) {
        fences.push(fence({ position: [x, 1] }));
        fences.push(fence({ position: [x, 18] }));
    }
    for (let y = 2; y < 18; y++) {
        fences.push(fence({ position: [1, y] }));
        fences.push(fence({ position: [18, y] }));
    }
}

const headStones: StaticGameObject[] = [];
const walls: StaticGameObject[] = [];

walls.push(wall({ position: [5, 3]}));
walls.push(wall({ position: [9, 3]}));
walls.push(wall({ position: [13, 3]}));
//
walls.push(wall({ position: [4, 4]}));
walls.push(wall({ position: [6, 4]}));
walls.push(wall({ position: [8, 4]}));
walls.push(wall({ position: [10, 4]}));
walls.push(wall({ position: [12, 4]}));
walls.push(wall({ position: [14, 4]}));
//
walls.push(wall({ position: [4, 5]}));
walls.push(windowHorizontal({ position: [5, 5]}));
walls.push(wall({ position: [6, 5]}));
walls.push(wall({ position: [8, 5]}));
walls.push(windowHorizontal({ position: [9, 5], transparency: '3'}));
walls.push(wall({ position: [10, 5]}));
walls.push(wall({ position: [12, 5]}));
walls.push(windowHorizontal({ position: [13, 5], transparency: '6'}));
walls.push(wall({ position: [14, 5]}));

if (true) {  // random objects
    for (let y = 8; y < 17; y += 2) {
        const parts = 2;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            const newHeadStone = headStone({ position: [x, y] });
            headStones.push(newHeadStone);
        }
    }
}

const tree2 = pineTree({ position: [7, 12] });
const campfires = [
    campfire({ position: [5, 4] }),
    campfire({ position: [9, 4] }),
    campfire({ position: [13, 4] }),
    //
    campfire({ position: [3, 17] }),
];

const doors = [
    new Door("lights", { position: [7, 12] }),
];

const objects = [...fences, ...walls, tree2, ...campfires, ...headStones, ...doors];
const level = new Level('lights', objects, Tiles.createEmptyDefault());
export const lightsLevel = level;