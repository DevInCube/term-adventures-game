import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { Scene } from "../../engine/Scene";

export class Bee extends Npc {
    type = "bee";
    maxHealth = 1;
    health = 1;
    constructor() {
        super(new ObjectSkin(`🐝`, `.`, {
            '.': ['yellow', 'transparent'],
        }), [0, 0]);
    }
    new() {
        return new Bee();
    }
    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        //
        const self = this;
        self.direction = [0, 0];
        //
        this.moveRandomly();
        if (!scene.isPositionBlocked(self.cursorPosition)) {
            self.move();
        }
    }
}