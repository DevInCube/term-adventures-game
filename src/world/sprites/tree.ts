import { Sprite } from "../../engine/SpriteLoader";

const treeSpriteRaw = `width:3
height:4
name:
empty:'
color:o,#0c0,#0a0
color:0,#0a0,#080
color:1,#080,#060
color:S,#060,#040
color:H,sienna,transparent

no wind
'░'
░░░
░░░
'█'
'o'
o01
01S
'H'
wind
'▒'
▒▒▒
▒▒▒
'█'
'o'
o01
01S
'H'`;
export const treeSprite = Sprite.parse(treeSpriteRaw);
//console.log(treeSprite);