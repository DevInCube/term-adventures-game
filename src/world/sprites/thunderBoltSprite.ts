import { Sprite } from "../../engine/data/Sprite";

export const thunderBoltSpriteRaw = `width:1
height:4
name:
empty:'
color:R,#fa0,transparent

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
