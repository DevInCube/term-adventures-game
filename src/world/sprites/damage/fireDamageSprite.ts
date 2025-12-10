import { Sprite } from "../../../engine/data/Sprite";

const fireDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#FF5,#0000

particle
🔥💥🔥💥
RRRR`;

export const fireDamageSprite = Sprite.parse(fireDamageSpriteRaw);
