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
import { Lamp } from "../objects/lamp";
import { LightSource } from "../objects/signals/LightSource";
import { pineTree } from "../objects/pineTree";
import { Colors } from "../../engine/math/Colors";

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
    portal('huge_tree_portal_west').translateX(10).translateY(12),
    portal('desert_portal_west').translateX(12).translateY(12),
];

const chest = new Chest().translateX(7).translateY(7);
chest.inventory.addItems([bambooSeed()]);

const targetPractice = new Target().translateX(11).translateY(7);

const aDoor = door({ position: [9, 5], isOpened: false });

const lightSourceY = 24;
const treeY = lightSourceY + 1; // TODO: put trees in front of light sources (+1).
const tree2Y = treeY - 5;
const lightsDemo = [
    new Lamp({ position: [23, 7], isOn: true }),
    pineTree({ position: [5, treeY] }),
    pineTree({ position: [5, tree2Y ] }),
    new LightSource({ position: [5, lightSourceY], depth: 0, intensity: 'F', requiresSignal: false }),
    pineTree({ position: [20, treeY] }),
    pineTree({ position: [20, tree2Y ] }),
    new LightSource({ position: [20, lightSourceY], depth: 1, intensity: 'F', requiresSignal: false }),
    pineTree({ position: [35, treeY] }),
    pineTree({ position: [35, tree2Y ] }),
    new LightSource({ position: [35, lightSourceY], depth: 2, intensity: 'F', requiresSignal: false }),
    new LightSource({ position: [35, 7], depth: 0, color: Colors.Blue, intensity: 'F', requiresSignal: false }),
];

const objects = [...fences, house1, ...portals, chest, targetPractice, aDoor, ...lightsDemo];
const level = new Level('devHub', objects, Tiles.createEmpty(new Vector2(width, height)));
export const devHubLevel = level;