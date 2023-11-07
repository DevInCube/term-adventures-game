import { chest } from "../objects/chest";
import { lamp } from "../objects/lamp";
import { house } from "../objects/house";
import { createTextObject } from "../../utils/misc";
import { emitEvent } from "../../engine/events/EventLoop";
import { GameEvent } from "../../engine/events/GameEvent";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { pineTree } from "../objects/pineTree";
import { door } from "../objects/door";
import { bamboo } from "../objects/bamboo";
import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";

const lamps: StaticGameObject[] = [
    lamp({ position: [2, 5] }),
    lamp({ position: [17, 5] }),
];
const doors = [
    door({ position: [10, 10] }),
];
const house1 = house({ position: [5, 10] });
const tree1 = pineTree({ position: [2, 12] });
const chest1 = chest();


export const trees: StaticGameObject[] = [];

if (true) {  // random trees
    for (let y = 6; y < 18; y++) {
        const x = (Math.random() * 8 + 1) | 0;
        trees.push(bamboo({ position: [x, y] }));
        const x2 = (Math.random() * 8 + 8) | 0;
        trees.push(bamboo({ position: [x2, y] }));
    }
    for (let tree of trees) {
        tree.setAction(0, 5, (obj) => {
            obj.enabled = false;
            // console.log("Cut tree"); @todo sent event
        });
    }
}

const ulan = new Npc(new ObjectSkin('🐻', `.`, {
    '.': [undefined, 'transparent'],
}), [4, 4]);
ulan.setAction(0, 0, (o) => {
    emitEvent(new GameEvent(o, "user_action", {
        subtype: "npc_talk",
        object: o,
    }));
});

const npcs = [
    ulan,
];

const objects = [house1, chest1, tree1, ...trees, ...lamps, ...npcs, ...doors];
export const introLevel = new Level('intro', objects);
introLevel.portals['intro_door'] = [[10, 10]];

// scripts
chest1.setAction(0, 0, function () {
    emitEvent(new GameEvent(chest1, "add_object", { object: createTextObject(`VICTORY!`, 6, 6)}));
});