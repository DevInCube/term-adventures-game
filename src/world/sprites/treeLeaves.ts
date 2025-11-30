import { Sprite } from "../../engine/data/Sprite";

const treeLeavesSpriteRaw = `width:4
height:3
name:
empty:'
color:o,#0c0,#0a0
color:0,#0a0,#080
color:1,#080,#060
color:S,#060,#040
color:H,sienna,transparent

no wind
'░░'
░░░░
░░░░
'oo'
o010
01S1
wind
'▒▒'
▒▒▒▒
▒▒▒▒
'oo'
o010
01S1`;
export const treeLeavesSprite = Sprite.parse(treeLeavesSpriteRaw);