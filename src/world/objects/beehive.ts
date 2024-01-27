import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { honeyPot } from "../items";
import { storageAction } from "../actions";
import { Vector2 } from "../../engine/math/Vector2";

export function beehive(options: { position: [number, number]; }) {
    const obj = new StaticGameObject(
        Vector2.zero,
        new ObjectSkin(`☷`, `R`, {
            'R': ['black', 'orange'],
        }),
        new ObjectPhysics(`.`),
        Vector2.from(options.position));
    obj.inventory.addItems([honeyPot()]);
    obj.setAction(storageAction(obj))
    return obj;
}
