import { Object2D } from "../../engine/objects/Object2D";
import { ObjectPhysicsBuilder } from "../../engine/data/ObjectPhysicsBuilder";
import { Vector2 } from "../../engine/math/Vector2";
import { hugeTreeTrunkSprite } from "../sprites/hugeTreeTrunkSprite";

export function hugeTreeTrunk(options: { position: [number, number]; }) {
    return new Object2D(
        new Vector2(7, 4),
        hugeTreeTrunkSprite.frames["default"][0],
        new ObjectPhysicsBuilder(`
         
         
         
         
    ...  
   ..... 
  ... ...
`).build(), Vector2.from(options.position));
}
