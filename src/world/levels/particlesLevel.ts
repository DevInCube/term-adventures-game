import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Level } from "../../engine/Level";
import { fence } from "../objects/fence";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Campfire } from "../objects/campfire";
import { Scene } from "../../engine/Scene";

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

const fires = [
    new Campfire([10, 10]),
    new Campfire([5, 20]),
];

const doors = [
    door('particles', { position: [2, 2] }),
];

const objects = [...fences, ...doors, ...fires];
export const particlesLevel = new class extends Level{ 
    constructor() {
        super('particles', objects, Tiles.createEmpty(width, height));
        this.wind = [1, 1];
    }
    
    onLoaded(scene: Scene): void {
        super.onLoaded(scene);
        //this.changeWeather("snow");
    }
}();