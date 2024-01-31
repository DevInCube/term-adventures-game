import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Object2D } from "../../engine/objects/Object2D";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { emitEvent } from "../../engine/events/EventLoop";
import { TeleportToEndpointGameEvent } from "../events/TeleportToEndpointGameEvent";
import { Vector2 } from "../../engine/math/Vector2";

export class Door extends Object2D {
    constructor (
        name: string,
        options: { position: [number, number]; }) {
        super(Vector2.zero,
            new ObjectSkin().char(`🚪`).color('red'),
            new ObjectPhysics(),
            Vector2.from(options.position));

        this.name = name;
        this.type = "door";
        this.setAction({
            type: "collision",
            action: ctx => emitEvent(TeleportToEndpointGameEvent.create(name, ctx.obj, ctx.initiator))});
    }
}

export function door(id: string, options: { position: [number, number]; }) {
    return new Door(id, options);
}
