import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../../../engine/objects/StaticGameObject";


export const pillar = (options: { position: [number, number]; }) => new StaticGameObject([0, 3],
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
 
 
. `), options.position);
