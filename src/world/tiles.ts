import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { TileInfo } from "../engine/data/TileInfo";
import { FireDamageEffect } from "../engine/effects/DamageEffect";
import { SlownessEffect } from "../engine/effects/SlownessEffect";
import { dustSprite } from "./sprites/dustSprite";
import { lavaDisturbanceSprite } from "./sprites/lavaDisturbanceSprite";
import { waterRippleSprite } from "./sprites/waterRippleSprite";

export const tiles = {
    mountain: new TileInfo('#986A6A', 'mountain', "elevated"),
    water: new TileInfo('#358', 'water', "liquid")
        .addDisturbanceSprite(waterRippleSprite),
    water_deep: new TileInfo('#246', 'water_deep', "liquid")
        .addDisturbanceSprite(waterRippleSprite),
    grass: new TileInfo('#350', 'grass'),
    grass_tall: new TileInfo('#240', 'grass_tall'),
    sand: new TileInfo('#b80', 'sand', "solid")
        .addDisturbanceSprite(dustSprite)
        .addEffect(new SlownessEffect("sand", 0.2)),
    bridge_stone: new TileInfo('#444', 'bridge_stone', "solid"),
    bridge_stone_dark: new TileInfo('#333', 'bridge_stone_dark', "solid"),
    lava: new TileInfo('#c33', 'lava', "liquid")
        .addDisturbanceSprite(lavaDisturbanceSprite)
        .addPhysics(new ObjectPhysics().light('5').temperature('9'))
        .addEffect(new SlownessEffect("lava", 0.5))
        .addEffect(new FireDamageEffect()),
};