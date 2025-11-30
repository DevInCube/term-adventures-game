import { Sprite } from "../../engine/data/Sprite";

const hugeTreeTrunkSpriteRaw = `width:9
height:7
name:
empty:'
color:H,sienna,sienna

default
██''''''█
'██'''███
''██'███'
'''████''
'''█████'
'''█████'
''███████
HH''''''H
'HH'''HHH
''HH'HHH'
'''HHHH''
'''HHHHH'
'''HHHHH'
''HHHHHHH`;
export const hugeTreeTrunkSprite = Sprite.parse(hugeTreeTrunkSpriteRaw);