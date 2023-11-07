import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { treeSprite } from "../sprites/tree";
import { Tree } from "./Tree";

class PineTree extends Tree {
    constructor(position: [number, number]) {
        super([1, 3],
            treeSprite,
            new ObjectPhysics(`


 .`, '', '', ` . 
...
   
   `), position);
    }
}


export function pineTree(options: { position: [number, number]}) {
    return new PineTree(options.position);
}