import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { house } from "../objects/house";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import Chest from "../objects/chest";
import { bambooSeed } from "../items";
import { Deer } from "../npcs/deer";

const fences: StaticGameObject[] = [];

if (true) {  // add fence
    for (let x = 0; x < 20; x++) {
        fences.push(fence({ position: [x, 0] }));
        fences.push(fence({ position: [x, 19] }));
    }
    for (let y = 1; y < 19; y++) {
        fences.push(fence({ position: [0, y] }));
        fences.push(fence({ position: [19, y] }));
    }
}

const house1 = house({ position: [6, 2] });

const doors = [
    door({ position: [2, 2] }),
    door({ position: [2, 4] }),
    door({ position: [6, 2] }),
];

const chest = new Chest([7, 7]);
chest.inventory.addItems([bambooSeed()]);

const deer1 = new Deer([15, 12]);
const deer2 = new Deer([13, 13]);

const objects = [...fences, house1, ...doors, chest, deer1, deer2];
const level = new Level('devHub', objects);
level.portals['lights'] = [[2, 2]];
level.portals['dungeon'] = [[2, 4]];
level.portals['house'] = [[6, 2]];
export const devHubLevel = level;