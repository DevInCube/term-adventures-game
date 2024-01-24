import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { campfire } from "../objects/campfire";
import { fillLayer, forLayer } from "../../utils/layer";
import { wall } from "../objects/house";
import { Tiles } from "../../engine/data/Tiles";
import { mushroom } from "../objects/mushroom";

const walls: StaticGameObject[] = [];

if (true) {  // add border walls
    for (let x = 0; x < 20; x++) {
        walls.push(wall({ position: [x, 0] }));
        walls.push(wall({ position: [x, 19] }));
    }
    for (let y = 1; y < 19; y++) {
        walls.push(wall({ position: [0, y] }));
        walls.push(wall({ position: [19, y] }));
    }
}

if (true) {  // add random walls
    for (let y = 2; y < 17; y += 2) {
        const parts = 2;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            const newHeadStone = wall({ position: [x, y] });
            walls.push(newHeadStone);
        }
    }
}

const campfires = [
    campfire({ position: [3, 3] }),
    campfire({ position: [10, 13] }),
];

const mushrooms = [
    mushroom({ position: [3, 12] }),
];

const doors = [
    door('dungeon', { position: [2, 2] }),
];

const objects = [...walls, ...doors, ...campfires, ...mushrooms];
const level = new Level('dungeon', objects, Tiles.createEmptyDefault());
level.roofHolesLayer = fillLayer(level.size, false);
if (false) { // add test hole
    level.roofHolesLayer[7][8] = true;
    level.roofHolesLayer[8][7] = true;
    level.roofHolesLayer[8][8] = true;
    level.roofHolesLayer[8][9] = true;
    level.roofHolesLayer[9][8] = true;
}

level.roofLayer = fillLayer(level.size, 15);
if (true) { // add gradient
    forLayer(level.roofLayer, (l, [x, y]) => {
        const v = 8 + Math.sin(x / 2) * 8;
        const roofValue = Math.min(15, Math.max(0, Math.round(v)));
        l[y][x] = roofValue;
        if (roofValue === 0) {
            level.roofHolesLayer[y][x] = true;
        }
    });
}

export const dungeonLevel = level;