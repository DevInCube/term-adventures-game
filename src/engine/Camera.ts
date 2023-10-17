import { Level } from "./Level";
import { Npc } from "./Npc";

const followOffset: number = 4;

export class Camera {
    position = {
        left: 0,
        top: 0,
    }
    size = {
        width: 20,
        height: 20,
    };

    npc: Npc | null = null;
    level: Level | null = null;

    follow(npc: Npc, level: Level) {
        this.npc = npc;
        this.level = level;
    }

    update() {
        if (this.npc && this.level) {
            const leftRel = this.npc.position[0] - this.position.left; 
            if (leftRel < followOffset) {
                this.position.left = Math.max(0, this.npc.position[0] - followOffset);
            }

            const topRel = this.npc.position[1] - this.position.top;
            if (topRel < followOffset) {
                this.position.top = Math.max(0, this.npc.position[1] - followOffset);
            }

            const rightRel = (this.position.left + this.size.width) - this.npc.position[0];
            if (rightRel < followOffset) {
                this.position.left = Math.min(this.level.width - this.size.width, this.npc.position[0] - this.size.width + followOffset);
            }

            const bottomRel = (this.position.top + this.size.height) - this.npc.position[1];
            if (bottomRel < followOffset) {
                this.position.top = Math.min(this.level.height - this.size.height, this.npc.position[1] - this.size.height + followOffset);
            }

        }
    }
}