import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Campfire } from "../objects/campfire";
import { Scene } from "../../engine/Scene";
import { VolcanicGasMist } from "../objects/particles/VolcanicGasMist";
import { Object2D } from "../../engine/objects/Object2D";
import { VolcanicMouth } from "../objects/volcanicMouth";
import { volcano } from "../objects/volcano";
import { Vector2 } from "../../engine/math/Vector2";

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

const trees: Object2D[] = [
    // TODO: add burnt tree trunks.
];

const volcanoes = [
    volcano({ position: [9, 14]}),
]

const fires = [
    new VolcanicMouth(Vector2.from([12, 12])),
    new VolcanicMouth(Vector2.from([12, 13])),
    new VolcanicMouth(Vector2.from([13, 12])),
    new VolcanicMouth(Vector2.from([13, 13])),
    //
    new VolcanicMouth(Vector2.from([10, 5])),
    new VolcanicMouth(Vector2.from([3, 16])),
];

const doors = [
    door('volcanic', { position: [2, 2] }),
];

const objects = [...fences, ...doors, ...trees, ...volcanoes, ...fires];
export const volcanicLevel = new class extends Level{ 
    constructor() {
        super('volcanic', objects, Tiles.createEmpty(width, height));
        this.wind = new Vector2(1, 0);
    }
    
    onLoaded(scene: Scene): void {
        super.onLoaded(scene);
        this.fillGasMist(scene);
        this.changeWeather("ashfall");
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
        this.fillGasMist(scene);
    }

    private fillGasMist(scene: Scene) {
        const box = scene.windBox;
        for (let y = box.min.y; y < box.max.y; y++) {
            for (let x = box.min.x; x < box.max.x; x++) {
                const p = new Vector2(x, y);
                if (scene.isParticlePositionBlocked(p)) {
                    continue;
                }

                scene.tryAddParticle(new VolcanicGasMist(p));
            }
        }
    }
}();