import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";

export class Door extends StaticGameObject {
    constructor() {
        super([0, 0], new ObjectSkin(`🚪`, `V`, {
            V: ['red', 'transparent'],
        }), new ObjectPhysics(` `), [10, 10]);
    }

    new() { return new Door(); }
}