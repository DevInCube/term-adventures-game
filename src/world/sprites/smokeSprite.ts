import { Sprite } from "../../engine/data/Sprite";

const smokeSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0000,#aaaA
color:T,#0000,#aaa8
color:Y,#0000,#aaa5

particle
'''''''
RRTTYYY`;
export const smokeSprite = Sprite.parse(smokeSpriteRaw);
