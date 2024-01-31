import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkinBuilder } from "../../engine/data/ObjectSkinBuilder";
import { ObjectPhysicsBuilder } from "../../engine/data/ObjectPhysicsBuilder";
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
        new ObjectPhysicsBuilder(`        
 ...... 
........`).build(), Vector2.from(options.position));
}
