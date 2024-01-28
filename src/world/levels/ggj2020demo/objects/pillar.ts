import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../../../engine/components/ObjectSkinBuilder";
import { Vector2 } from "../../../../engine/math/Vector2";
import { Object2D } from "../../../../engine/objects/Object2D";


export const pillar = (options: { position: [number, number]; }) => new Object2D(new Vector2(0, 3),
    new ObjectSkinBuilder(`▄
█
█
▓`, `L
H
H
B`, {
        'L': ['yellow', 'transparent'],
        'H': ['white', 'transparent'],
        'B': ['#777', 'transparent'],
    }).build(),
    new ObjectPhysics(` 
 
 
. `), Vector2.from(options.position));
