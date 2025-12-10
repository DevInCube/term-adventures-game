import { Sprite } from "../../../engine/data/Sprite";

const bluntDamageSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#FF5,#0000

particle
✴💥💢
RRR`;

export const bluntDamageSprite = Sprite.parse(bluntDamageSpriteRaw);
