import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { fillLayer } from "../../utils/layer";
import { wall, windowHorizontal } from "../objects/house";
import { Tiles } from "../../engine/data/Tiles";

const walls: StaticGameObject[] = [];

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

const campfires: StaticGameObject[] = [
    //campfire({ position: [10, 13] }),
];

const doors = [
    door('house', { position: [left + 2, top + 2] }),
];

const objects = [...walls, ...doors, ...campfires];
const level = new Level('house', objects, Tiles.createEmptyDefault());
level.roofHolesLayer = [];
fillLayer(level.roofHolesLayer, level.width, level.height, true);
level.roofLayer = [];
fillLayer(level.roofLayer, level.width, level.height, 0);
if (true) { // add gradient
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            level.roofHolesLayer[top + y][left + x] = false;
            level.roofLayer[top + y][left + x] = 15;
        }
    }
}

export const houseLevel = level;