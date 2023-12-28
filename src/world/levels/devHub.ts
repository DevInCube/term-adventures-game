import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { house } from "../objects/house";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import Chest from "../objects/chest";
import { bambooSeed } from "../items";
import { Tiles } from "../../engine/data/Tiles";

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
    door('lights', { position: [2, 2] }),
    door('dungeon', { position: [2, 4] }),
    door('house', { position: [6, 2] }),
    door('terrain_door', { position: [6, 6] }),
];

const chest = new Chest([7, 7]);
chest.inventory.addItems([bambooSeed()]);

const objects = [...fences, house1, ...doors, chest];
const level = new Level('devHub', objects, Tiles.createEmptyDefault());
export const devHubLevel = level;