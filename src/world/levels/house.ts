import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { wall, windowHorizontal } from "../objects/house";
import { Tiles } from "../../engine/data/Tiles";
import { tiles } from "../tiles";
import { LightSource } from "../objects/signals/LightSource";
import { Color } from "../../engine/math/Color";
import { Vector2 } from "../../engine/math/Vector2";
import { Grid } from "../../engine/math/Grid";

const walls: Object2D[] = [];

const margin = 2;
const left = margin;
const top = margin;
const width = 20 - margin * 2;
const height = 20 - margin * 2;
if (true) {  // add border walls
    for (let x = 0; x < width; x++) {
        const object = (x < 6 || x > 9) ? wall : windowHorizontal;
        walls.push(object({ position: [margin + x, top] }));
        walls.push(object({ position: [margin + x, margin + height - 1] }));
    }
    for (let y = 0; y < height; y++) {
        walls.push(wall({ position: [left, margin + y] }));
        walls.push(wall({ position: [margin + width - 1, margin + y] }));
    }
}

const campfires: Object2D[] = [
    //campfire({ position: [10, 13] }),
];

const lightSources = [
    new LightSource({ position: [6, 10], color: new Color(1, 0, 0), requiresSignal: false}),
    new LightSource({ position: [12, 10], color: new Color(0, 1, 0), requiresSignal: false }),
    new LightSource({ position: [9, 13], color: new Color(0, 0, 1), requiresSignal: false }),
];

const doors = [
    door('house', { position: [left + 2, top + 2] }),
];

const objects = [...walls, ...doors, ...campfires, ...lightSources];
const level = new Level('house', objects, Tiles.createEmptyDefault());
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