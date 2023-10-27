import { Level } from "../../engine/Level";
import { level } from "./ggj2020demo/level";
import { introLevel } from "./intro";
import { lightsLevel } from "./lights";
import { sheepLevel } from "./sheep";

const list = [introLevel, lightsLevel, sheepLevel, level];
export const levels : {[key: string]: Level} = {};
for (const item of list) {
    levels[item.id] = item;
}