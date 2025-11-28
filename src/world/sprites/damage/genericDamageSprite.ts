import { Sprite } from "../../../engine/data/Sprite";

const genericDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#F55F,transparent

particle
◟◝ノ◞
RRRR`;

export const genericDamageSprite = Sprite.parse(genericDamageSpriteRaw);
