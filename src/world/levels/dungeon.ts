import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { campfire } from "../objects/campfire";
import { wall } from "../objects/house";
import { Tiles } from "../../engine/data/Tiles";
import { mushroom } from "../objects/mushroom";
import { Grid } from "../../engine/math/Grid";
import { clamp } from "../../utils/math";

const walls: Object2D[] = [];

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
level.roofHolesLayer = new Grid<boolean>(level.size).fillValue(false);

level.roofLayer = new Grid<number>(level.size).fillValue(15);
if (true) { // add gradient
    level.roofLayer.traverse((_, pos, l) => {
        const v = 8 + Math.sin(pos.x / 2) * 8;
        const roofValue = clamp(Math.round(v), 0, 15);
        l.setAt(pos, roofValue);
        if (roofValue === 0) {
            level.roofHolesLayer.setAt(pos, true);
        }
    });
}

export const dungeonLevel = level;