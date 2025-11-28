import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Object2D } from "../../engine/objects/Object2D";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { emitEvent } from "../../engine/events/EventLoop";
import { TeleportToEndpointGameEvent } from "../events/TeleportToEndpointGameEvent";
import { Vector2 } from "../../engine/math/Vector2";

export class Portal extends Object2D {
    constructor (
        name: string,
        options: { position: [number, number]; }) {
        super(Vector2.zero,
            new ObjectSkin().char(`🌀`).color('red').background('#000'),
            new ObjectPhysics(),
            Vector2.from(options.position));

        this.name = name;
        this.type = "portal";
        this.setAction({
            type: "collision",
            action: ctx => emitEvent(TeleportToEndpointGameEvent.create(name, ctx.obj, ctx.initiator))});
    }
}

export function portal(id: string, options: { position: [number, number]; } = { position: [0, 0] }) {
    return new Portal(id, options);
}
