import { Level } from "../../engine/Level";
import { level } from "./ggj2020demo/level";
import { introLevel } from "./intro";
import { sheepLevel } from "./sheep";

const list = [introLevel, sheepLevel, level];
export const levels : {[key: string]: Level} = {};
for (const item of list) {
    levels[item.id] = item;
}