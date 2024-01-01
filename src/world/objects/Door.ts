import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Level } from "../../engine/Level";
import { emitEvent } from "../../engine/events/EventLoop";
import { TeleportToEndpointGameEvent } from "../events/TeleportToEndpointGameEvent";

export class Door extends StaticGameObject {
    constructor (
        public id: string,
        options: { position: [number, number]; }) {
        super([0, 0],
            new ObjectSkin(`🚪`, `V`, {
                V: ['red', 'transparent'],
            }),
            new ObjectPhysics(` `),
            options.position);

        this.setAction({
            type: "collision",
            action: ctx => emitEvent(TeleportToEndpointGameEvent.create(id, ctx.obj, ctx.initiator))});
    }

    bindToLevel(level: Level): void {
        super.bindToLevel(level);

        if (!level.portals[this.id]) {
            level.portals[this.id] = [];
        }
        
        if (!level.portals[this.id].find(x => x[0] === this.position[0] && x[1] === this.position[1])) {
            level.portals[this.id].push(this.position);
        }
    }
}

export function door(id: string, options: { position: [number, number]; }) {
    return new Door(id, options);
}
