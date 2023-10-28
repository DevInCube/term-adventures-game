import { Level } from "../../engine/Level";
import { devHubLevel } from "./devHub";
import { dungeonLevel } from "./dungeon";
import { level } from "./ggj2020demo/level";
import { introLevel } from "./intro";
import { lightsLevel } from "./lights";
import { sheepLevel } from "./sheep";

const list = [devHubLevel, introLevel, lightsLevel, sheepLevel, level, dungeonLevel];
export const levels : {[key: string]: Level} = {};
for (const item of list) {
    levels[item.id] = item;
}