import { chest, flowers, house, trees, lamp } from "../objects";
import { clone, createTextObject } from "../../utils/misc";
import { emitEvent } from "../../engine/events/EventLoop";
import { GameEvent } from "../../engine/events/GameEvent";
import { npcs } from "../npcs";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { Tree } from "../objects/Tree";
import { PineTree } from "../objects/PineTree";
import { Door } from "../objects/Door";

const lamps: StaticGameObject[] = [
    clone(lamp, { position: [2, 5] }),
    clone(lamp, { position: [17, 5] }),
];
const door = new Door();
const doors = [
    clone(door, { position: [10, 10] }),
];
const objects = [...flowers, house, chest, new PineTree(), ...trees, ...lamps, ...npcs, ...doors];
export const introLevel = new Level('intro', objects);
introLevel.portals['intro_door'] = [[10, 10]];

// scripts
chest.setAction(0, 0, function () {
    emitEvent(new GameEvent(chest, "add_object", { object: createTextObject(`VICTORY!`, 6, 6)}));
});