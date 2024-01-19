import { Sprite } from "../../engine/data/Sprite";

const darkSmokeSpriteRaw = `width:1
height:1
name:
empty:'
color:R,transparent,#333c
color:T,transparent,#444a
color:Y,transparent,#5558

particle
''''''''''
RRRRTTTYYY`;
export const darkSmokeSprite = Sprite.parse(darkSmokeSpriteRaw);
