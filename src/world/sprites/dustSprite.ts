import { Sprite } from "../../engine/data/Sprite";

const dustSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#555,transparent

particle
.·ᣟᣟ·.
RRRRRR`;

export const dustSprite = Sprite.parse(dustSpriteRaw);
