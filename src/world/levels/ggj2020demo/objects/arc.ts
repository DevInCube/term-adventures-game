import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { Vector2 } from "../../../../engine/math/Vector2";
import { Object2D } from "../../../../engine/objects/Object2D";


export const arc = (options: { position: [number, number]; }) => new Object2D(new Vector2(2, 3),
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
     
     
.   .`), Vector2.from(options.position));
