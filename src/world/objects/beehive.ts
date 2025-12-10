import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { honeyPot } from "../items";
import { storageAction } from "../actions";
import { Vector2 } from "../../engine/math/Vector2";
import { Colors } from "../../engine/math/Colors";

export function beehive(options: { position: [number, number]; }) {
    const obj = new Object2D(
        Vector2.zero,
        new ObjectSkin().char(`☷`).color(Colors.Black).background(Colors.Orange),
        new ObjectPhysics().collision(),
        Vector2.from(options.position));
    obj.inventory.addItems([honeyPot()]);
    obj.setAction(storageAction(obj))
    return obj;
}
