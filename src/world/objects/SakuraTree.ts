import { StaticGameObject } from "../../engine/StaticGameObject";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { ObjectPhysics } from "../../engine/ObjectPhysics";


export class SakuraTree extends StaticGameObject {
    constructor() {
        super([2, 3], new ObjectSkin(` ░░ 
░░░░
 ░░
  █`, ` oo 
o01o
 1S
  H`, {
            'o': ['#c3829e', '#fcd1d7'],
            '0': ['#fcd1d7', '#e9b1cd'],
            '1': ['#e9b1cd', '#c3829e'],
            'S': ['#c3829e', '#562135'],
            'H': ['sienna', 'transparent'],
        }),
            new ObjectPhysics(`
    
    
 .`, ''), [2, 12]);
    }

    new() { return new SakuraTree(); }
}
