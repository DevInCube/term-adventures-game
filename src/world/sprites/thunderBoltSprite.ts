import { Sprite } from "../../engine/data/Sprite";

export const thunderBoltSpriteRaw = `width:1
height:4
name:
empty:'
color:R,#fa0,#0000

particle
ϟ↯⚕↯
↯⚕↯ϟ
⚕↯ϟ↯
↯ϟ↯⚕
RRRR
RRRR
RRRR
RRRR`;
export const thunderBoltSprite = Sprite.parse(thunderBoltSpriteRaw);
