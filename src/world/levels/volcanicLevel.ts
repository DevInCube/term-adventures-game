import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Campfire } from "../objects/campfire";
import { Scene } from "../../engine/Scene";
import { VolcanicGasMist } from "../objects/particles/VolcanicGasMist";
import { SceneObject } from "../../engine/objects/SceneObject";
import { VolcanicMouth } from "../objects/volcanicMouth";
import { volcano } from "../objects/volcano";

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

const trees: SceneObject[] = [
    // TODO: add burnt tree trunks.
];

const volcanoes = [
    volcano({ position: [9, 14]}),
]

const fires = [
    new VolcanicMouth([12, 12]),
    new VolcanicMouth([12, 13]),
    new VolcanicMouth([13, 12]),
    new VolcanicMouth([13, 13]),
    //
    new VolcanicMouth([10, 5]),
    new VolcanicMouth([3, 16]),
];

const doors = [
    door('volcanic', { position: [2, 2] }),
];

const objects = [...fences, ...doors, ...trees, ...volcanoes, ...fires];
export const volcanicLevel = new class extends Level{ 
    constructor() {
        super('volcanic', objects, Tiles.createEmpty(width, height));
        this.wind = [1, 0];
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
        const border = scene.windBorder;
        for (let y = -border[1]; y < height + border[1]; y++) {
            for (let x = -border[0]; x < width + border[0]; x++) {
                const p: [number, number] = [x, y];
                if (scene.isParticlePositionBlocked(p)) {
                    continue;
                }

                scene.tryAddParticle(new VolcanicGasMist(p));
            }
        }
    }
}();