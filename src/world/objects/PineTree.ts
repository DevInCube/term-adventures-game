import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { treeSprite } from "../sprites/tree";
import { Tree } from "./Tree";

export class PineTree extends Tree {
    constructor() {
        super([1, 3],
            treeSprite,
            new ObjectPhysics(`


 .`, '', '', ` . 
...
   
   `), [2, 12]);
    }

    new() { return new PineTree(); }
}
