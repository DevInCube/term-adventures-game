import { Level } from "./Level";
import { Vector2 } from "./math/Vector2";
import { Npc } from "./objects/Npc";

const followOffset: number = 4;

export class Camera {
    position: Vector2 = Vector2.zero;
    size: Vector2 = new Vector2(20, 20);

    npc: Npc | null = null;
    level: Level | null = null;

    follow(npc: Npc, level: Level) {
        this.npc = npc;
        this.level = level;
    }

    // TODO: use Vector2.clamp.
    update() {
        if (this.npc && this.level) {

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
                this.position.x = (Math.min(this.level.size.width - this.size.width, this.npc.position.x - (this.size.width - 1) + followOffset));
            }

            const bottomRel = cameraRightBottom.y - this.npc.position.y;
            if (bottomRel < followOffset) {
                this.position.y = (Math.min(this.level.size.height - this.size.height, this.npc.position.y - (this.size.height - 1) + followOffset));
            }

            if (cameraRightBottom.x > this.level.size.width) {
                this.position.x = (this.level.size.width - this.size.width);
            }

            if (cameraRightBottom.y > this.level.size.height) {
                this.position.y = (this.level.size.height - this.size.height);
            }
        }
    }
}