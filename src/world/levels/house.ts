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

const margin = 2;
const left = margin;
const top = margin;
const width = 20 - margin * 2;
const height = 20 - margin * 2;
if (true) {  // add border walls
    for (let x = 0; x < width; x++) {
        if (x < 5 || x > 6) {
            walls.push(clone(wall, { position: [margin + x, top] }));
        }
        walls.push(clone(wall, { position: [margin + x, margin + height - 1] }));
    }
    for (let y = 0; y < height; y++) {
        walls.push(clone(wall, { position: [left, margin + y] }));
        walls.push(clone(wall, { position: [margin + width - 1, margin + y] }));
    }
}

const campfire = new Campfire();
const campfires = [
    clone(campfire, { position: [10, 13] }),
];

const door = new Door();
const doors = [
    clone(door, { position: [left + 2, top + 2] }),
];

const objects = [...walls, ...doors, ...campfires];
const level = new Level('dungeon', objects);
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

level.portals['house'] = [[left + 2, top + 2]];
export const houseLevel = level;