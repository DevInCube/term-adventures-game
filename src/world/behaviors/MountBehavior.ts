import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { GameEvent } from "../../engine/events/GameEvent";
import { WanderingBehavior } from "./WanderingBehavior";
import { emitEvent } from "../../engine/events/EventLoop";
import { MountGameEvent } from "../events/MountGameEvent";
import { RemoveObjectGameEvent } from "../events/RemoveObjectGameEvent";
import { AddObjectGameEvent } from "../events/AddObjectGameEvent";
import { Vector2 } from "../../engine/math/Vector2";

const _position = new Vector2();
const _direction = new Vector2();

export class MountBehavior implements Behavior {

    state: "wild" | "mounted" = "wild";
    mounterObject: Npc | null = null;
    wanderingBeh: WanderingBehavior = new WanderingBehavior();

    constructor(
        public mountObject: Npc, 
        public options: {} = {}) {
    }

    update(ticks: number, object: Npc): void {
        const state = this.state;
        this.mountObject.parameters["isMounted"] = state === "mounted";
        if (state === "wild") {
            this.wanderingBeh.update(ticks, object);
        }
    }

    act(ticks: number, object: Npc): void {
        
    }

    handleEvent(ev: GameEvent, object: Npc): void {
    }

    mount(mounter: Npc) {
        this.mounterObject = mounter;
        this.state = "mounted";

        // Link mount and mounter.
        mounter.mount = this.mountObject;
        mounter.add(this.mountObject);

        // Update mount to have position relative to the mounter.
        mounter.mount.position.copy(Vector2.zero);

        // Move mounter on top of the mount.
        mounter.position.add(mounter.getWorldDirection(_direction));

        // Remove mount from the scene.
        emitEvent(RemoveObjectGameEvent.create(this.mountObject));
        
        emitEvent(MountGameEvent.create(mounter, this.mountObject, "mounted"));
    }

    unmount() {
        const mount = this.mountObject;
        const mounter = this.mounterObject;
        if (!mounter) {
            return;
        }

        if (!mounter.scene) {
            console.error(`Can not unmount ${mounter.type}. Mounter is not bound to the scene.`);
            return;
        }

        if (mounter.scene.isPositionBlocked(mounter.getWorldCursorPosition(_position))) {
            console.log(`Can not unmount ${mounter.type}. Position blocked.`);
            return;
        }

        this.mounterObject = null;
        this.state = "wild";

        // Unlink mount and mounter.
        mounter.mount = null;
        mount.removeFromParent();
        
        // Move mount to the mounter position.
        mount.position.copy(mounter.position);

        // Add mount back to the scene.
        emitEvent(AddObjectGameEvent.create(mount));

        // Move mounter forward.
        mounter.position.add(mounter.getWorldDirection(_direction));

        emitEvent(MountGameEvent.create(mounter, this.mountObject, "unmounted"));
    }
}
