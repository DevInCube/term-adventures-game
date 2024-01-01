import { Npc } from "../../engine/objects/Npc";
import { Behavior } from "../../engine/objects/Behavior";
import { GameEvent } from "../../engine/events/GameEvent";
import { WanderingBehavior } from "./WanderingBehavior";
import { emitEvent } from "../../engine/events/EventLoop";
import { MountGameEvent } from "../events/MountGameEvent";

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
        this.mountObject.mounter = this.mounterObject;

        // Update mount to face the same direction as mounter.
        MountBehavior.updateMount(mounter);

        // Move mounter on top of the mount.
        MountBehavior.moveMounter(mounter);

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
        mount.mounter = null;
        
        // Move mounter forward.
        mounter.position = [...mounter.cursorPosition];
        
        emitEvent(MountGameEvent.create(mounter, this.mountObject, "unmounted"));
    }

    static updateMount(mounter: Npc) {
        if (!mounter.mount) {
            return;
        }
        
        mounter.mount.direction = [...mounter.direction];
    }
    
    static moveMounter(mounter: Npc) {
        if (!mounter?.mount) {
            return;
        }
        
        // Update state from mount.
        mounter.realm = mounter.mount.realm;
        mounter.direction = [...mounter.mount.direction];
        mounter.position = [...mounter.mount.position];
    }
}
