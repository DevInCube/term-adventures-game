import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/data/Vector2";

export function volcano(options: { position: [number, number]; }) {
    return new StaticGameObject(new Vector2(0, 2),
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
