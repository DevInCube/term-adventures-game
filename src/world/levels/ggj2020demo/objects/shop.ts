import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../../../engine/components/ObjectSkinBuilder";
import { Vector2 } from "../../../../engine/math/Vector2";
import { Object2D } from "../../../../engine/objects/Object2D";


export const shop = (options: { position: [number, number]; }) => new Object2D(new Vector2(2, 3),
    new ObjectSkinBuilder(`▄▟▄▄▄▙▄
 █   █
 █████`, `LLLLLLL
 H   H
 BTTTB`, {
        'L': ['lightgray', 'brown'],
        'H': ['gray', 'transparent'],
        'B': ['brown', 'transparent'],
        'T': ['orange', 'brown'],
    }).build(),
    new ObjectPhysics(`       
       
 ..... `), Vector2.from(options.position));
