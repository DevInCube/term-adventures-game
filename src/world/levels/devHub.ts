import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { house } from "../objects/house";
import { fence } from "../objects/fence";
import { portal } from "../objects/portal";
import { Chest } from "../objects/chest";
import { bambooSeed } from "../items";
import { Tiles } from "../../engine/data/Tiles";
import { Vector2 } from "../../engine/math/Vector2";
import { Target } from "../npcs/target";
import { door } from "../objects/Door";

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

const portals = [
    portal('lights', { position: [2, 2] }),
    portal('dungeon', { position: [2, 4] }),
    portal('intro', { position: [2, 8] }),
    portal('house', { position: [6, 2] }),
    portal('terrain_portal', { position: [6, 6] }),
    portal('ggj2020demo_portal', { position: [12, 2] }),
    portal('sheeps_portal', { position: [2, 10] }),
    portal('particles', { position: [4, 10] }),
    portal('mistland', { position: [6, 10] }),
    portal('volcanic', { position: [8, 10] }),
    portal('signals', { position: [10, 10] }),
    portal('signal_lights', { position: [12, 10] }),
    portal('effects_level').translateX(2).translateY(12),
    portal('target_practice').translateX(4).translateY(12),
    portal('bridge_portal_west').translateX(6).translateY(12),
    portal('iceberg_portal_west').translateX(8).translateY(12),
];

const chest = new Chest().translateX(7).translateY(7);
chest.inventory.addItems([bambooSeed()]);

const targetPractice = new Target().translateX(11).translateY(7);

const aDoor = door({ position: [9, 5], isOpened: false });

const objects = [...fences, house1, ...portals, chest, targetPractice, aDoor];
const level = new Level('devHub', objects, Tiles.createEmpty(new Vector2(width, height)));
export const devHubLevel = level;