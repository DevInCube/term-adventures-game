import { TileInfo } from "../engine/data/TileInfo";

export const tiles = {
    mountain: new TileInfo('#986A6A', 'mountain', "elevated"),
    water: new TileInfo('#358', 'water', "liquid"),
    water_deep: new TileInfo('#246', 'water_deep', "liquid"),
    grass: new TileInfo('#350', 'grass'),
    grass_tall: new TileInfo('#240', 'grass_tall'),
    sand: new TileInfo('#b80', 'sand', "solid", 0.8),
    bridge_stone: new TileInfo('#444', 'bridge_stone', "solid", 1.2),
    bridge_stone_dark: new TileInfo('#333', 'bridge_stone_dark', "solid", 1.2),
};