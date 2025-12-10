import { Sprite } from "../../engine/data/Sprite";

const tracksSpriteRaw = `width:1
height:1
name:
empty:'
color:R,#555F,#0000
color:r,#5558,#0000
color:o,#5552,#0000

particle
.....
RRrro`;

export const tracksSprite = Sprite.parse(tracksSpriteRaw);
