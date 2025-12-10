import { Sprite } from "../../engine/data/Sprite";

const darkSmokeSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#0000,#333c
color:T,#0000,#444a
color:Y,#0000,#5558

particle
''''''''''
RRRRTTTYYY`;
export const darkSmokeSprite = Sprite.parse(darkSmokeSpriteRaw);
