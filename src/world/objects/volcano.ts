import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkinBuilder } from "../../engine/data/ObjectSkinBuilder";
import { ObjectPhysicsBuilder } from "../../engine/data/ObjectPhysicsBuilder";
import { Vector2 } from "../../engine/math/Vector2";
import { Colors } from "../../engine/math/Colors";

export function volcano(options: { position: [number, number]; }) {
    return new Object2D(new Vector2(0, 2),
        new ObjectSkinBuilder(`        
        
        `, `  oMMo
 ooMMoo
oooooooo`, {
            M: [Colors.Black, Colors.DarkRed],
            o: [Colors.Black, Colors.SaddleBrown]
        }).build(),
        new ObjectPhysicsBuilder(`        
 ...... 
........`).build(), Vector2.from(options.position));
}
