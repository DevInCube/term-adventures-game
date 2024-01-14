import { Sprite } from "../../engine/data/Sprite";

const waterRippleSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#082e54,transparent

particle
·◌○⨀Ⓞ◯
RRRRRR`;
export const waterRippleSprite = Sprite.parse(waterRippleSpriteRaw);