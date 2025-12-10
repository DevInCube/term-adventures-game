import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { portal } from "../objects/portal";
import { wall, windowHorizontal } from "../objects/house";
import { Tiles } from "../../engine/data/Tiles";
import { LightSource } from "../objects/signals/LightSource";
import { Vector2 } from "../../engine/math/Vector2";
import { Grid } from "../../engine/math/Grid";
import { door } from "../objects/Door";
import { Colors } from "../../engine/math/Colors";

const walls: Object2D[] = [];

const margin = 2;
const left = margin;
const top = margin;
const levelWidth = 21;
const levelHeight = 20;
const width = levelWidth - margin * 2;
const height = levelHeight - margin * 2;
if (true) {  // add border walls
    for (let x = 0; x < width; x++) {
        const object = (x < 6 || x > 10) ? wall : windowHorizontal;
        walls.push(object({ position: [margin + x, top] }));
        walls.push(object({ position: [margin + x, margin + height - 1] }));
    }
    for (let y = 0; y < height; y++) {
        if (y === 2) {
            walls.push(door({ position: [left, margin + y], isOpened: false }));
            walls.push(door({ position: [margin + width - 1, margin + y], isOpened: false }));
            continue;
        }

        walls.push(wall({ position: [left, margin + y] }));
        walls.push(wall({ position: [margin + width - 1, margin + y] }));
    }
}

const campfires: Object2D[] = [
    //campfire({ position: [10, 13] }),
];

const x = 8;
const y = 8;
const lightSources = [
    new LightSource({ position: [x, y], color: Colors.Red, requiresSignal: false}),
    new LightSource({ position: [x + 4, y], color: Colors.Green, requiresSignal: false }),
    new LightSource({ position: [x + 2, y + 3], color: Colors.Blue, requiresSignal: false }),
];

const portals = [
    portal('house', { position: [left + 2, top + 2] }),
];

const objects = [...walls, ...portals, ...campfires, ...lightSources];
const level = new Level('house', objects, Tiles.createEmpty(new Vector2(levelWidth, levelHeight)));
level.roofHolesLayer = new Grid<boolean>(level.size).fillValue(true);
level.roofLayer = new Grid<number>(level.size).fillValue(0);
if (true) { // add gradient
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            level.roofHolesLayer.setAt(new Vector2(left + x, top + y), false);
            level.roofLayer.setAt(new Vector2(left + x, top + y), 15);
        }
    }
}

export const houseLevel = level;