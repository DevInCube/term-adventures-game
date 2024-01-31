import { ObjectPhysicsBuilder } from "../../../../engine/data/ObjectPhysicsBuilder";
import { ObjectSkinBuilder } from "../../../../engine/data/ObjectSkinBuilder";
import { Vector2 } from "../../../../engine/math/Vector2";
import { Object2D } from "../../../../engine/objects/Object2D";


export const arc = (options: { position: [number, number]; }) => new Object2D(new Vector2(2, 3),
    new ObjectSkinBuilder(`▟▄▄▄▙
█   █
█   █
█   █`, `LLLLL
H   H
H   H
B   B`, {
        'L': ['orange', 'brown'],
        'H': ['white', 'transparent'],
        'B': ['gray', 'transparent'],
    }).build(),
    new ObjectPhysicsBuilder(`     
     
     
.   .`).build(), Vector2.from(options.position));
