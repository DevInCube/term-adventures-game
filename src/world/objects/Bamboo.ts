import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkinBuilder } from "../../engine/data/ObjectSkinBuilder";
import { Vector2 } from "../../engine/math/Vector2";
import { emitEvent } from "../../engine/events/EventLoop";
import { Object2D } from "../../engine/objects/Object2D";
import { RemoveObjectGameEvent } from "../events/RemoveObjectGameEvent";
import { TransferItemsGameEvent } from "../events/TransferItemsGameEvent";
import { bambooSeed } from "../items";
import { Color } from "../../engine/math/Color";
import { Colors } from "../../engine/math/Colors";

export function bamboo(options: { position: [number, number] }) {
    const origin = new Vector2(0, 5);
    const object = new Object2D(origin,
    new ObjectSkinBuilder(`▄
█
█
█
█
█`, `T
H
L
H
L
D`, {
        // https://colorpalettes.net/color-palette-412/
        'T': [Color.fromHexString('#99bc20'), Colors.Transparent],
        'L': [Color.fromHexString('#517201'), Colors.Transparent],
        'H': [Color.fromHexString('#394902'), Colors.Transparent],
        'D': [Color.fromHexString('#574512'), Colors.Transparent],
    }).build(), new ObjectPhysics().collision(origin), Vector2.from(options.position));
    object.type = "bamboo";
    // TODO: only using an axe.
    object.setAction({
        position: origin,
        action: ctx => {
            emitEvent(RemoveObjectGameEvent.create(ctx.obj));
            emitEvent(TransferItemsGameEvent.create(ctx.initiator, [bambooSeed()]));
        }});
    return object;
}