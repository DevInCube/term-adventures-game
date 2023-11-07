import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";


export const shop = (options: { position: [number, number]; }) => new StaticGameObject([2, 3],
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
       
 ..... `), options.position);
