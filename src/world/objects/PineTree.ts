import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { treeSprite } from "../sprites/tree";
import { Tree } from "./Tree";

class PineTree extends Tree {
    constructor(position: Vector2) {
        super(new Vector2(1, 3),
            treeSprite,
            new ObjectPhysics(`


 .`, '', '', ` . 
...
   
   `), position);
    }
}


export function pineTree(options: { position: [number, number]}) {
    return new PineTree(Vector2.from(options.position));
}