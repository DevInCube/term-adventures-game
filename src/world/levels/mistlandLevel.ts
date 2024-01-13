import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Campfire } from "../objects/campfire";
import { Scene } from "../../engine/Scene";
import { Mist } from "../objects/particles/Mist";
import { pineTree } from "../objects/pineTree";

const fences: StaticGameObject[] = [];

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
    new Campfire([12, 12]),
];

const doors = [
    door('mistland', { position: [2, 2] }),
];

const objects = [...fences, ...doors, ...trees, ...fires];
export const mistlandLevel = new class extends Level{ 
    constructor() {
        super('mistland', objects, Tiles.createEmpty(width, height));
        this.wind = [1, 0];
    }
    
    onLoaded(scene: Scene): void {
        super.onLoaded(scene);
        this.fillMist(scene);
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        this.fillMist(scene);
    }

    private fillMist(scene: Scene) {
        const border = scene.windBorder;
        for (let y = -border[1]; y < height + border[1]; y++) {
            for (let x = -border[0]; x < width + border[0]; x++) {
                const p: [number, number] = [x, y];
                if (scene.isParticlePositionBlocked(p)) {
                    continue;
                }

                scene.tryAddParticle(new Mist(p));
            }
        }
    }
}();