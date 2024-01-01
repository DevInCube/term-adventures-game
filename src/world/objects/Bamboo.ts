import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { emitEvent } from "../../engine/events/EventLoop";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { RemoveObjectGameEvent } from "../events/RemoveObjectGameEvent";
import { TransferItemsGameEvent } from "../events/TransferItemsGameEvent";
import { bambooSeed } from "../items";

export function bamboo(options: { position: [number, number] }) {
    const object = new StaticGameObject([0, 4],
    new ObjectSkin(`▄
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
        'T': ['#99bc20', 'transparent'],
        'L': ['#517201', 'transparent'],
        'H': ['#394902', 'transparent'],
        'D': ['#574512', 'transparent'],
    }), new ObjectPhysics(` 
 
 
 
 
.`, ``), options.position);

    // TODO: only using an axe.
    object.setAction({
        position: [0, 5],
        action: ctx => {
            emitEvent(RemoveObjectGameEvent.create(ctx.obj));
            emitEvent(TransferItemsGameEvent.create(ctx.initiator, [bambooSeed()]));
        }});
    return object;
}