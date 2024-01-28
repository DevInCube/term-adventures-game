import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";

export function volcano(options: { position: [number, number]; }) {
    return new Object2D(new Vector2(0, 2),
        new ObjectSkinBuilder(`        
        
        `, `  oMMo
 ooMMoo
oooooooo`, {
            M: ["black", "darkred"],
            o: ["black", "saddlebrown"]
        }).build(),
        new ObjectPhysics(`        
 ...... 
........`, ''), Vector2.from(options.position));
}
