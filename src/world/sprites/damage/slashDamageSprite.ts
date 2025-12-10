import { Sprite } from "../../../engine/data/Sprite";

const slashDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#FF5,#0000

particle
◟◝ノ◝◞
RRRRR`;

export const slashDamageSprite = Sprite.parse(slashDamageSpriteRaw);
