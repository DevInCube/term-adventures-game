import { Level } from "../../engine/Level";
import { portal } from "../objects/portal";
import { Tiles } from "../../engine/data/Tiles";
import { Vector2 } from "../../engine/math/Vector2";
import { tiles } from "../tiles";
import { Tile } from "../../engine/objects/Tile";
import { cactus } from "../objects/natural";

const portals = [
    portal('desert_portal_west', { position: [2, 2] }),
];

const cactuses = [
    { position: [7, 4] },
    { position: [17, 15] },
    { position: [26, 24] },
    { position: [14, 7] },
    { position: [24, 13] },
    { position: [37, 9] },
    { position: [8, 11] },
].map((x: { position: [number, number] }) => cactus(x));


const objects = [...portals, ...cactuses];

const levelTiles = Tiles.createEmptyMap(new Vector2(40, 30), () => tiles.sand)
    .map(tile => tile!.setSandLevel(Math.round(Math.random() * Tile.maxSandLevel) | 0)!); // TODO: seeded random.

export const desertLevel = new Level('desert', objects, levelTiles);
desertLevel.defaultTemperatureAtDay = 15;
desertLevel.defaultTemperatureAtNight = 0;
