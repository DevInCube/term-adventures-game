import { Sprite } from "../../engine/data/Sprite";

const smokeSpriteRaw = `width:1
height:1
name:
empty:'
color:R,transparent,#aaaA
color:T,transparent,#aaa8
color:Y,transparent,#aaa5

particle
'''''''
RRTTYYY`;
export const smokeSprite = Sprite.parse(smokeSpriteRaw);
