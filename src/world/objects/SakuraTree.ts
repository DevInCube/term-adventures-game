import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { sakuraSprite } from "../sprites/sakura";
import { Tree } from "./Tree";

class SakuraTree extends Tree {
    constructor(position: [number, number]) {
        super([2, 3], 
            sakuraSprite,
            new ObjectPhysics(`
    
    
  .`, '', '', ` .. 
....
    
    `), position);
    }
}

export function sakuraTree(options: { position: [number, number]}) {
    return new SakuraTree(options.position);
}