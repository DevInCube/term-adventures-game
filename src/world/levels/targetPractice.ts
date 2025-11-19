import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { wall, windowHorizontal } from "../objects/house";
import { Tiles } from "../../engine/data/Tiles";
import { LightSource } from "../objects/signals/LightSource";
import { Color } from "../../engine/math/Color";
import { target } from "../npcs/target";

const walls: Object2D[] = [];

const margin = 1;
const left = margin;
const top = margin;
const width = 20 - margin * 2;
const height = 20 - margin * 2;
if (true) {
    for (let x = 0; x < width; x++) {
        const object = wall;
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
    new LightSource({ position: [2, 2], color: new Color(1, 1, 1), requiresSignal: false}),
    new LightSource({ position: [2, 17], color: new Color(1, 1, 1), requiresSignal: false }),
    new LightSource({ position: [17, 2], color: new Color(1, 1, 1), requiresSignal: false }),
    new LightSource({ position: [17, 17], color: new Color(1, 1, 1), requiresSignal: false }),
];

const targets = [
    target({ position: [10, 10] }),
    target({ position: [16, 16] }),
    target({ position: [6, 7] }),
];

const doors = [
    door('target_practice', { position: [left + 2, top + 2] }),
];

const objects = [...walls, ...doors, ...campfires, ...lightSources, ...targets];
const level = new Level('targetPractice', objects, Tiles.createEmptyDefault());

export const targetPracticeLevel = level;