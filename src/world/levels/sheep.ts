import { Npc } from "../../engine/Npc";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { Scene } from "../../engine/Scene";
import { StaticGameObject } from "../../engine/StaticGameObject";
import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { distanceTo, clone } from "../../utils/misc";
import { campfire, tree } from "../objects";
import { GameEvent } from "../../engine/GameEvent";
import { SceneObject } from "../../engine/SceneObject";
import { Sheep } from "../npcs/Sheep";
import { Wolf } from "../npcs/Wolf";

const vFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);
const hFence = new StaticGameObject(
    [0, 0],
    new ObjectSkin(`☗`, '.', { '.': ['Sienna', 'transparent'] }),
    new ObjectPhysics('.'),
    [0, 0]);

const sheeps: Npc[] = [];
const wolves: Npc[] = [];
const fences: StaticGameObject[] = [];

const sheep = new Sheep();

if (true) {  // add fence
    for (let x = 1; x < 19; x++) {
        fences.push(clone(hFence, { position: [x, 1] }));
        fences.push(clone(hFence, { position: [x, 18] }));
    }
    for (let y = 2; y < 18; y++) {
        fences.push(clone(vFence, { position: [1, y] }));
        fences.push(clone(vFence, { position: [18, y] }));
    }
}

if (true) {  // random sheeps
    for (let y = 2; y < 17; y++) {
        const parts = 4;
        for (let p = 0; p < parts; p++) {
            const x = 1 + (16 / parts * p) + (Math.random() * (16 / parts) + 1) | 0;
            const newSheep = clone(sheep, { position: [x, y] });
            sheeps.push(newSheep);
        }
    }
}

const wolf = new Wolf();
wolves.push(wolf);

const tree2 = clone(tree, { position: [7, 9] });
const campfires = [
    clone(campfire, [10, 10]),
];
export const sheepLevel = [...sheeps, ...wolves, ...fences, tree2, ...campfires];