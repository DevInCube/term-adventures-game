import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Campfire } from "../objects/campfire";

const fences: StaticGameObject[] = [];

const width = 44;
const height = 44;
if (true) {  // add fence
    for (let x = 0; x < width; x++) {
        fences.push(fence({ position: [x, 0] }));
        fences.push(fence({ position: [x, height - 1] }));
    }
    for (let y = 1; y < height - 1; y++) {
        fences.push(fence({ position: [0, y] }));
        fences.push(fence({ position: [width - 1, y] }));
    }
}

const fires = [
    new Campfire([10, 10]),
];

const doors = [
    door('particles', { position: [2, 2] }),
];

const objects = [...fences, ...doors, ...fires];
export const particlesLevel = new Level('particles', objects, Tiles.createEmpty(width, height));