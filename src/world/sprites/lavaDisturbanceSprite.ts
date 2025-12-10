import { Sprite } from "../../engine/data/Sprite";

const lavaDisturbanceSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#fc5,#0000

particle
.·ᣟᣟ·.
RRRRRR`;

export const lavaDisturbanceSprite = Sprite.parse(lavaDisturbanceSpriteRaw);
