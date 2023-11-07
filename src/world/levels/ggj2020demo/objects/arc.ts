import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";


export const arc = (options: { position: [number, number]; }) => new StaticGameObject([2, 3],
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
     
     
.   .`), options.position);
