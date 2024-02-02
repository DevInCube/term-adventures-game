import { Vector2 } from "../math/Vector2";
import { Npc } from "../objects/Npc";
import { Camera, followOffset } from "./Camera";

export class FollowCamera extends Camera {

    constructor(
        public npc: Npc,
        private boundingSize: Vector2
    ) {
        super();
        this.npc = npc;
        this.boundingSize = boundingSize;
    }

    // TODO: use Vector2.clamp.
    update() {
        super.update();
        const cameraRightBottom = this.position.clone().add(this.size).sub(new Vector2(1, 1));

        const leftRel = this.npc.position.x - this.position.x;
        if (leftRel < followOffset) {
            this.position.x = (Math.max(0, this.npc.position.x - followOffset));
        }

        const topRel = this.npc.position.y - this.position.y;
        if (topRel < followOffset) {
            this.position.y = (Math.max(0, this.npc.position.y - followOffset));
        }

        const rightRel = cameraRightBottom.x - this.npc.position.x;
        if (rightRel < followOffset) {
            this.position.x = (Math.min(this.boundingSize.width - this.size.width, this.npc.position.x - (this.size.width - 1) + followOffset));
        }

        const bottomRel = cameraRightBottom.y - this.npc.position.y;
        if (bottomRel < followOffset) {
            this.position.y = (Math.min(this.boundingSize.height - this.size.height, this.npc.position.y - (this.size.height - 1) + followOffset));
        }

        if (cameraRightBottom.x > this.boundingSize.width) {
            this.position.x = (this.boundingSize.width - this.size.width);
        }

        if (cameraRightBottom.y > this.boundingSize.height) {
            this.position.y = (this.boundingSize.height - this.size.height);
        }
    }
}