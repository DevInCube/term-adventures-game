import { ObjectPhysics } from "../../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../../engine/objects/StaticGameObject";

export const pillar = new StaticGameObject([0, 3],
    new ObjectSkin(`▄
█
█
▓`, `L
H
H
B`, {
        'L': ['yellow', 'transparent'],
        'H': ['white', 'transparent'],
        'B': ['#777', 'transparent'],
    }),
    new ObjectPhysics(` 
 
 
. `), [0, 0]);

export const arc = new StaticGameObject([2, 3],
    new ObjectSkin(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
        'L': ['orange', 'brown'],
        'H': ['white', 'transparent'],
        'B': ['gray', 'transparent'],
    }),
    new ObjectPhysics(`     
     
     
.   .`), [0, 0]);

export const shop = new StaticGameObject([2, 3],
    new ObjectSkin(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
        'L': ['lightgray', 'brown'],
        'H': ['gray', 'transparent'],
        'B': ['brown', 'transparent'],
        'T': ['orange', 'brown'],
    }),
    new ObjectPhysics(`       
       
 ..... `), [0, 0]);