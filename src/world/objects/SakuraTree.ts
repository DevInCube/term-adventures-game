import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { sakuraSprite } from "../sprites/sakura";
import { Tree } from "./Tree";

class SakuraTree extends Tree {
    constructor(position: Vector2) {
        const origin = new Vector2(2, 3); 
        super(origin, sakuraSprite, new ObjectPhysics().collision(origin), position);
    }
}

export function sakuraTree(options: { position: [number, number]}) {
    return new SakuraTree(Vector2.from(options.position));
}