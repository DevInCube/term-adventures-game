import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { GameEvent } from "../../engine/events/GameEvent";
import { WanderingBehavior } from "./WanderingBehavior";
import { emitEvent } from "../../engine/events/EventLoop";
import { MountGameEvent } from "../events/MountGameEvent";
import { RemoveObjectGameEvent } from "../events/RemoveObjectGameEvent";
import { AddObjectGameEvent } from "../events/AddObjectGameEvent";
import { Vector2 } from "../../engine/data/Vector2";

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

    handleEvent(ev: GameEvent, object: Npc): void {
    }

    mount(mounter: Npc) {
        this.mounterObject = mounter;
        this.state = "mounted";

        // Link mount and mounter.
        mounter.mount = this.mountObject;
        this.mountObject.parent = mounter;

        // Update mount to have position relative to the mounter.
        mounter.mount.position = Vector2.zero;

        // Move mounter on top of the mount.
        mounter.position = mounter.cursorPosition.clone();

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

        if (mounter.scene && mounter.scene.isPositionBlocked(mounter.cursorPosition)) {
            console.log(`Can not unmount ${mounter.type}. Position blocked.`);
            return;
        }

        this.mounterObject = null;
        this.state = "wild";

        // Unlink mount and mounter.
        mounter.mount = null;
        mount.parent = null;
        
        // Move mount to the mounter position.
        mount.position = mounter.position.clone();

        // Add mount back to the scene.
        emitEvent(AddObjectGameEvent.create(mount));

        // Move mounter forward.
        mounter.position = mounter.cursorPosition.clone();

        emitEvent(MountGameEvent.create(mounter, this.mountObject, "unmounted"));
    }
}
