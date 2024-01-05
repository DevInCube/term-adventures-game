import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { storageAction } from "../actions";

export default class Chest extends StaticGameObject {
    constructor(position: [number, number]) {
        super(
            [0, 0], 
            new ObjectSkin(`🧰`),
            new ObjectPhysics(`.`, ''),
            position);

        this.setAction(storageAction(this));
    }
}

export const chest = () => new Chest([2, 10]);
