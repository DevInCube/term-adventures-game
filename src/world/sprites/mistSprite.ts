import { Sprite } from "../../engine/data/Sprite";

const mistSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0000,#fff6
color:T,#0000,#fff4
color:Y,#0000,#fff2

particle
''''''''''
YTRRRRRTTY`;
export const mistSprite = Sprite.parse(mistSpriteRaw);
