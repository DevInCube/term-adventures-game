import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { honeyPot } from "../items";
import { storageAction } from "../actions";
import { Vector2 } from "../../engine/math/Vector2";

export function beehive(options: { position: [number, number]; }) {
    const obj = new Object2D(
        Vector2.zero,
        new ObjectSkinBuilder(`☷`, `R`, {
            'R': ['black', 'orange'],
        }).build(),
        new ObjectPhysics(`.`),
        Vector2.from(options.position));
    obj.inventory.addItems([honeyPot()]);
    obj.setAction(storageAction(obj))
    return obj;
}
