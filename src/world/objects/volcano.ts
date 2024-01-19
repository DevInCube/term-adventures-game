import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";

export function volcano(options: { position: [number, number]; }) {
    return new StaticGameObject([0, 2],
        new ObjectSkin(`        
        
        `, `  oMMo
 ooMMoo
oooooooo`, {
            M: ["black", "darkred"],
            o: ["black", "saddlebrown"]
        }),
        new ObjectPhysics(`        
 ...... 
........`, ''), options.position);
}
