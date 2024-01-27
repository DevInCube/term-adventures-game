import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { house } from "../objects/house";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import Chest from "../objects/chest";
import { bambooSeed } from "../items";
import { Tiles } from "../../engine/data/Tiles";
import { Vector2 } from "../../engine/math/Vector2";

const fences: Object2D[] = [];

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

const house1 = house({ position: [6, 2] });

const doors = [
    door('lights', { position: [2, 2] }),
    door('dungeon', { position: [2, 4] }),
    door('intro', { position: [2, 8] }),
    door('house', { position: [6, 2] }),
    door('terrain_door', { position: [6, 6] }),
    door('ggj2020demo_door', { position: [12, 2] }),
    door('sheeps_door', { position: [2, 10] }),
    door('particles', { position: [4, 10] }),
    door('mistland', { position: [6, 10] }),
    door('volcanic', { position: [8, 10] }),
    door('signals', { position: [10, 10] }),
    door('signal_lights', { position: [12, 10] }),
];

const chest = new Chest(new Vector2(7, 7));
chest.inventory.addItems([bambooSeed()]);

const objects = [...fences, house1, ...doors, chest];
const level = new Level('devHub', objects, Tiles.createEmpty(width, height));
export const devHubLevel = level;