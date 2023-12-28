import { Npc } from "../../engine/objects/Npc";
import { Scene } from "../../engine/Scene";
import { Behavior } from "../../engine/objects/Behavior";
import { GameEvent } from "../../engine/events/GameEvent";
import { WanderingBehavior } from "./WanderingBehavior";

export class MountBehavior implements Behavior {

    state: "wild" | "mounted" = "wild";
    mounterObject: Npc | null = null;
    wanderingBeh: WanderingBehavior = new WanderingBehavior();

    constructor(
        public mountObject: Npc, 
        public options: {} = {}) {
    }

    update(ticks: number, scene: Scene, object: Npc): void {
        const state = this.state;
        this.mountObject.parameters["isMounted"] = state === "mounted";
        if (state === "wild") {
            this.wanderingBeh.update(ticks, scene, object);
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

        // TODO: event and player message.
        console.log(`${mounter.type} mounted ${this.mountObject.type}.`);
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
        mounter.position[0] = mounter.cursorPosition[0];
        mounter.position[1] = mounter.cursorPosition[1];
        
        // TODO: event and player message.
        console.log(`${mounter.type} unmounted ${this.mountObject.type}.`);
    }

    static updateMount(mounter: Npc) {
        if (!mounter.mount) {
            return;
        }
        
        mounter.mount.direction[0] = mounter.direction[0];
        mounter.mount.direction[1] = mounter.direction[1];
    }
    
    static moveMounter(mounter: Npc) {
        if (!mounter?.mount) {
            return;
        }
        
        // Update state from mount.
        mounter.realm = mounter.mount.realm;
        mounter.direction[0] = mounter.mount.direction[0];
        mounter.direction[1] = mounter.mount.direction[1];
        mounter.position[0] = mounter.mount.position[0];
        mounter.position[1] = mounter.mount.position[1];
    }
}
