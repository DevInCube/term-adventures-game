import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Scene } from "../../engine/Scene";
import { LightDetector } from "../objects/signals/detectors/LightDetector";
import { Invertor } from "../objects/signals/Invertor";
import { Pipe } from "../objects/signals/Pipe";
import { Lever } from "../objects/signals/Lever";
import { WeatherDetector } from "../objects/signals/detectors/WeatherDetector";
import { LifeDetector } from "../objects/signals/detectors/LifeDetector";
import { FireDetector } from "../objects/signals/detectors/FireDetector";
import { LightSource } from "../objects/signals/LightSource";
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

const elements = [
    new LightSource({ position: [13, 3], color: [0, 255, 0], intensity: 'B', }),
    new Pipe({ position: [12, 3], orientation: "horizontal" }),
    new Lever({ position: [11, 3] }),
    //
    new LifeDetector({ position: [12, 6] }),
    new WeatherDetector({ position: [8, 8] }),
    new FireDetector({ position: [6, 6] }),
    //
    new LightDetector({ position: [9, 10] }),
    new Pipe({ position: [10, 10] }),
    new Invertor({ position: [11, 10] }),
    new Pipe({ position: [12, 10] }),
    new LightSource({ position: [13, 10], color: [255, 255, 255], intensity: 'B', }),
    new Pipe({ position: [11, 11], orientation: "vertical" }),
    new Lever({ position: [11, 12] }),
];

const doors = [
    door('signals', { position: [2, 2] }),
];

const objects = [...fences, ...doors, ...elements];
export const signalsLevel = new class extends Level{ 
    constructor() {
        super('signals', objects, Tiles.createEmpty(width, height));
        this.wind = new Vector2(1, 1);
    }
    
    onLoaded(scene: Scene): void {
        super.onLoaded(scene);
    }
}();