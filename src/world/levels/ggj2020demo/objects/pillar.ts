import { ObjectPhysics } from "../../../../engine/components/ObjectPhysics";
import { ObjectSkinBuilder } from "../../../../engine/data/ObjectSkinBuilder";
import { Vector2 } from "../../../../engine/math/Vector2";
import { Object2D } from "../../../../engine/objects/Object2D";


export const pillar = (options: { position: [number, number]; }) => {
    const origin = new Vector2(0, 3);
    const skin = new ObjectSkinBuilder(`▄
█
█
▓`, `L
H
H
B`, {
            'L': ['yellow', 'transparent'],
            'H': ['white', 'transparent'],
            'B': ['#777', 'transparent'],
        })
        .build();
    const physics = new ObjectPhysics().collision(origin);
    return new Object2D(origin, skin, physics, Vector2.from(options.position));
};
