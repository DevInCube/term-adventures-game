import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { StaticGameObject } from "../../engine/StaticGameObject";

export class Door extends StaticGameObject {
    constructor() {
        super([0, 0], new ObjectSkin(`🚪`, `V`, {
            V: ['red', 'transparent'],
        }), new ObjectPhysics(` `), [10, 10]);
    }

    new() { return new Door(); }
}