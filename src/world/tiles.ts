import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { TileInfo } from "../engine/data/TileInfo";
import { LightCloakEffect } from "../engine/effects/CloakEffect";
import { FireDamageEffect } from "../engine/effects/DamageEffect";
import { SlownessEffect } from "../engine/effects/SlownessEffect";
import { WaterWetnessEffect } from "../engine/effects/WetnessEffect";
import { tracksSprite } from "./sprites/tracksSprite";
import { lavaDisturbanceSprite } from "./sprites/lavaDisturbanceSprite";
import { waterRippleSprite } from "./sprites/waterRippleSprite";
import { Color } from "../engine/math/Color";

export const tiles = {
    mountain: new TileInfo(Color.fromHexString('#986A6A'), 'mountain', "elevated"),
    water: new TileInfo(Color.fromHexString('#358'), 'water', "liquid")
        .addDisturbanceSprite(waterRippleSprite)
        .addEffect(new WaterWetnessEffect()),
    water_deep: new TileInfo(Color.fromHexString('#246'), 'water_deep', "liquid")
        .addDisturbanceSprite(waterRippleSprite)
        .addEffect(new WaterWetnessEffect()),
    grass: new TileInfo(Color.fromHexString('#350'), 'grass'),
    grass_tall: new TileInfo(Color.fromHexString('#240'), 'grass_tall')
        .addEffect(new LightCloakEffect(1)),
    sand: new TileInfo(Color.fromHexString('#b80'), 'sand', "solid")
        .addDisturbanceSprite(tracksSprite)
        .addEffect(new SlownessEffect("sand", 0.2)),
    bridge_stone: new TileInfo(Color.fromHexString('#444'), 'bridge_stone', "solid"),
    bridge_stone_dark: new TileInfo(Color.fromHexString('#333'), 'bridge_stone_dark', "solid"),
    lava: new TileInfo(Color.fromHexString('#c33'), 'lava', "liquid")
        .addDisturbanceSprite(lavaDisturbanceSprite)
        .addPhysics(new ObjectPhysics().light('5').temperature('9'))
        .addEffect(new SlownessEffect("lava", 0.5))
        .addEffect(new FireDamageEffect()),
    ice: new TileInfo(Color.fromHexString('#789'), 'ice', "solid")
        .addPhysics(new ObjectPhysics().temperature('0')),
};