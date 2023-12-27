import { Npc } from "../../engine/objects/Npc";
import { Scene } from "../../engine/Scene";
import { Behavior } from "../../engine/objects/Behavior";
import { GameEvent } from "../../engine/events/GameEvent";

export class MountBehavior implements Behavior {

    state: "wild" | "mounted" = "wild";
    mounterObject: Npc | null = null;

    constructor(
        public mountObject: Npc, 
        public options: {} = {}) {
        
        mountObject.setAction(0, 0, ctx => {
            console.log(`${ctx.initiator.type} interacted with ${mountObject.type}.`);
            if (ctx.initiator.equipment.objectInMainHand?.type === "saddle") {
                this.mount(ctx.initiator);
            }
        });
    }

    update(ticks: number, scene: Scene, object: Npc): void {

        object.direction = [0, 0];

        const state = this.state;
        this.mountObject.parameters["isMounted"] = state === "mounted";
        if (state === "wild") {
            object.moveRandomly();
        }

        if (!scene.isPositionBlocked(object.cursorPosition)) {
            object.move();
        }
    }

    handleEvent(ev: GameEvent, object: Npc): void {
    }

    mount(mounter: Npc) {
        this.mounterObject = mounter;
        this.state = "mounted";
        mounter.mount = this.mountObject;
        mounter.position[0] = this.mountObject.position[0];
        mounter.position[1] = this.mountObject.position[1];
        // TODO: event and player message.
        console.log(`${mounter.type} mounted ${this.mountObject.type}.`);
    }

    unmount() {
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
        mounter.mount = null;
        // Move mounter forward.
        mounter.position[0] = mounter.cursorPosition[0];
        mounter.position[1] = mounter.cursorPosition[1];
        // TODO: event and player message.
        console.log(`${mounter.type} unmounted ${this.mountObject.type}.`);
    }
}
