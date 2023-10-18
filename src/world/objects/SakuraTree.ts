import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { sakuraSprite } from "../sprites/sakura";
import { Tree } from "./Tree";

export class SakuraTree extends Tree {
    constructor() {
        super([2, 3], 
            sakuraSprite,
            new ObjectPhysics(`
    
    
  .`, ''), [2, 12]);
    }

    new() { return new SakuraTree(); }
}
