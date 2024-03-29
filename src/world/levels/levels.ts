import { Level } from "../../engine/Level";
import { devHubLevel } from "./devHub";
import { dungeonLevel } from "./dungeon";
import { effectsLevel } from "./effectsLevel";
import { level } from "./ggj2020demo/level";
import { houseLevel } from "./house";
import { introLevel } from "./intro";
import { lightsLevel } from "./lights";
import { mistlandLevel } from "./mistlandLevel";
import { particlesLevel } from "./particlesLevel";
import { sheepLevel } from "./sheep";
import { signalLightsLevel } from "./signalLightsLevel";
import { signalsLevel } from "./signalsLevel";
import { terrainLevel } from "./terrain";
import { volcanicLevel } from "./volcanicLevel";

const dict = { devHubLevel, introLevel, lightsLevel, sheepLevel, level, dungeonLevel, houseLevel, terrainLevel, particlesLevel, mistlandLevel, volcanicLevel, signalsLevel, signalLightsLevel, effectsLevel };
export const rawLevels = dict;
export const levels : {[key: string]: Level} = {};
for (const item of Object.values(dict)) {
    levels[item.name] = item;
}