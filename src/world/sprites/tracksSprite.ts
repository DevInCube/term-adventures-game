import { Sprite } from "../../engine/data/Sprite";

const tracksSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#555F,transparent
color:r,#5558,transparent
color:o,#5552,transparent

particle
.....
RRrro`;

export const tracksSprite = Sprite.parse(tracksSpriteRaw);
