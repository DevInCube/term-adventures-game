import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { emitEvent } from "../../engine/events/EventLoop";
import { GameEvent } from "../../engine/events/GameEvent";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
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
        action: (ctx) => {
            const obj = ctx.obj;
            obj.enabled = false;
            // console.log("Cut tree"); @todo sent event
            emitEvent(new GameEvent(obj, "transfer_items", {
                recipient: ctx.initiator,
                items: [bambooSeed()],
            }));
        }});
    return object;
}