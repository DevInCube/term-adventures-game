import { Sprite } from "../../engine/data/Sprite";

const fallingAshSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#aaa9,#0000

particle
ᣟ˙·.
RRRR`;

export const fallingAshSprite = Sprite.parse(fallingAshSpriteRaw);
