import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Campfire } from "../objects/campfire";
import { Mist } from "../objects/particles/Mist";
import { pineTree } from "../objects/pineTree";
import { Vector2 } from "../../engine/math/Vector2";

const fences: Object2D[] = [];

const width = 24;
const height = 24;
if (true) {  // add fence
    for (let x = 0; x < width; x++) {
        fences.push(fence({ position: [x, 0] }));
        fences.push(fence({ position: [x, height - 1] }));
    }
    for (let y = 1; y < height - 1; y++) {
        fences.push(fence({ position: [0, y] }));
        fences.push(fence({ position: [width - 1, y] }));
    }
}

const trees = [
    pineTree({ position: [5, 12] }),
    pineTree({ position: [12, 5] }),
];

const fires = [
    new Campfire(new Vector2(12, 12)),
];

const doors = [
    door('mistland', { position: [2, 2] }),
];

const objects = [...fences, ...doors, ...trees, ...fires];
export const mistlandLevel = new class extends Level{ 
    constructor() {
        super('mistland', objects, Tiles.createEmpty(width, height));
        this.wind = new Vector2(1, 0);
    }
    
    onLoaded(): void {
        super.onLoaded();
        this.fillMist(this);
    }

    update(ticks: number) {
        super.update(ticks);
        this.fillMist(this);
    }

    private fillMist(scene: Level) {
        const box = scene.windBox;
        for (let y = box.min.y; y < box.max.y; y++) {
            for (let x = box.min.x; x < box.max.x; x++) {
                const p = new Vector2(x, y)
                if (scene.particlesObject.isParticlePositionBlocked(p)) {
                    continue;
                }

                scene.particlesObject.tryAddParticle(new Mist(p));
            }
        }
    }
}();