import { chest, flowers, house, tree, trees, lamp } from "../objects";
import { clone, createTextObject } from "../../utils/misc";
import { emitEvent } from "../../engine/EventLoop";
import { GameEvent } from "../../engine/GameEvent";
import { npcs } from "../npcs";
import { StaticGameObject } from "../../engine/StaticGameObject";
import { Level } from "../../engine/Level";

const lamps: StaticGameObject[] = [
    clone(lamp, { position: [2, 5] }),
    clone(lamp, { position: [17, 5] }),
];
export const introLevel = new Level([...flowers, house, chest, tree, ...trees, ...lamps, ...npcs]);

// scripts
chest.setAction(0, 0, function () {
    emitEvent(new GameEvent(chest, "add_object", { object: createTextObject(`VICTORY!`, 6, 6)}));
});