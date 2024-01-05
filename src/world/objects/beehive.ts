import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { honeyPot } from "../items";
import { storageAction } from "../actions";

export function beehive(options: { position: [number, number]; }) {
    const obj = new StaticGameObject([0, 0],
        new ObjectSkin(`☷`, `R`, {
            'R': ['black', 'orange'],
        }),
        new ObjectPhysics(`.`),
        options.position);
    obj.inventory.addItems([honeyPot()]);
    obj.setAction(storageAction(obj))
    return obj;
}
