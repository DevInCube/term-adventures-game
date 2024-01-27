import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";

export function volcano(options: { position: [number, number]; }) {
    return new Object2D(new Vector2(0, 2),
        new ObjectSkin(`        
        
        `, `  oMMo
 ooMMoo
oooooooo`, {
            M: ["black", "darkred"],
            o: ["black", "saddlebrown"]
        }),
        new ObjectPhysics(`        
 ...... 
........`, ''), Vector2.from(options.position));
}
