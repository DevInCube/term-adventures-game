import { TileInfo } from "../engine/data/TileInfo";
import { FireDamageEffect } from "../engine/effects/DamageEffect";
import { SlownessEffect } from "../engine/effects/SlownessEffect";

export const tiles = {
    mountain: new TileInfo('#986A6A', 'mountain', "elevated"),
    water: new TileInfo('#358', 'water', "liquid"),
    water_deep: new TileInfo('#246', 'water_deep', "liquid"),
    grass: new TileInfo('#350', 'grass'),
    grass_tall: new TileInfo('#240', 'grass_tall'),
    sand: new TileInfo('#b80', 'sand', "solid")
        .addEffect(new SlownessEffect("sand", 0.2)),
    bridge_stone: new TileInfo('#444', 'bridge_stone', "solid"),
    bridge_stone_dark: new TileInfo('#333', 'bridge_stone_dark', "solid"),
    lava: new TileInfo('#c33', 'lava', "liquid")
        .addEffect(new SlownessEffect("lava", 0.5))
        .addEffect(new FireDamageEffect()),
};