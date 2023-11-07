import { Npc } from "../../engine/objects/Npc";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { campfire } from "../objects/campfire";
import { sheep } from "../npcs/sheep";
import { wolf } from "../npcs/wolf";
import { Level } from "../../engine/Level";
import { pineTree } from "../objects/pineTree";
import { fence } from "../objects/fence";
import { door } from "../objects/door";

const sheeps: Npc[] = [];
const wolves: Npc[] = [];
const fences: StaticGameObject[] = [];

if (true) {  // add fence
    for (let x = 1; x < 19; x++) {
        fences.push(fence({ position: [x, 1] }));
        fences.push(fence({ position: [x, 18] }));
    }
    for (let y = 2; y < 18; y++) {
        fences.push(fence({ position: [1, y] }));
        fences.push(fence({ position: [18, y] }));
    }
}

if (true) {  // random sheeps
    for (let y = 2; y < 17; y++) {
        const parts = 4;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            const newSheep = sheep({ position: [x, y] });
            sheeps.push(newSheep);
        }
    }
}

wolves.push(wolf({ position: [15, 15] }));

const tree2 = pineTree({ position: [7, 9] });
const campfires = [
    campfire({ position: [10, 10] }),
];

const doors = [
    door({ position: [4, 2] }),
    door({ position: [14, 14] }),
    door({ position: [2, 2] }),
];

const objects = [...sheeps, ...wolves, ...fences, tree2, ...campfires, ...doors];
export const sheepLevel = new Level('sheep', objects);
sheepLevel.portals['sheep_door'] = [[4, 2], [14, 14]];
sheepLevel.portals['intro_door'] = [[2, 2]];