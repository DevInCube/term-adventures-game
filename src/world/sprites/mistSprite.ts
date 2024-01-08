import { Sprite } from "../../engine/data/Sprite";

const mistSpriteRaw = `width:1
height:1
name:
empty:'
color:R,transparent,#fff6
color:T,transparent,#fff4
color:Y,transparent,#fff2

particle
''''''''''
YTRRRRRTTY`;
export const mistSprite = Sprite.parse(mistSpriteRaw);
