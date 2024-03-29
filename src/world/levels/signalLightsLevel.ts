import { Object2D } from "../../engine/objects/Object2D";
import { Level } from "../../engine/Level";
import { door } from "../objects/door";
import { Tiles } from "../../engine/data/Tiles";
import { Invertor } from "../objects/signals/Invertor";
import { Pipe } from "../objects/signals/Pipe";
import { Lever } from "../objects/signals/Lever";
import { LightSource } from "../objects/signals/LightSource";
import { Vector2 } from "../../engine/math/Vector2";
import { PipeT } from "../objects/signals/PipeT";
import { PipeX } from "../objects/signals/PipeX";
import { hslToRgb } from "../../utils/color";
import { Rotations } from "../../engine/math/Rotation";

let fences: Object2D[] = [];

const width = 20;
const height = 20;
if (true) {  // add signal pipes
    const padding = 2;
    const center = new Vector2(9, 9);
    for (let x = padding + 1; x < width - padding - 1; x++) {
        fences.push(new PipeT({ position: [x, padding] }).rotate(Rotations.left));
        fences.push(new PipeT({ position: [x, height - padding - 1] }).rotate(Rotations.right));
        
        const angleTop = new Vector2(x, padding - 1).sub(center).angle;
        fences.push(new LightSource({ position: [x, padding - 1], color: hslToRgb(angleTop, 100, 50) }));
        const angleBottom = new Vector2(x, height - (padding - 1) - 1).sub(center).angle;
        fences.push(new LightSource({ position: [x, height - (padding - 1) - 1], color: hslToRgb(angleBottom, 100, 50) }));
    }
    for (let y = 1 + padding; y < height - padding - 1; y++) {
        fences.push(new PipeT({ position: [padding, y] }).rotate(Rotations.back));
        fences.push(new PipeT({ position: [width - padding - 1, y] }).rotate(Rotations.forward));

        const angleLeft = new Vector2(padding - 1, y).sub(center).angle;
        fences.push(new LightSource({ position: [padding - 1, y], color: hslToRgb(angleLeft, 100, 50) }));
        const angleRight = new Vector2(width - (padding - 1) - 1, y).sub(center).angle;
        fences.push(new LightSource({ position: [width - (padding - 1) - 1, y], color: hslToRgb(angleRight, 100, 50) }));
    }

    fences.push(new PipeX({ position: [padding, padding] }));
    fences.push(new PipeX({ position: [width - padding - 1, padding] }));
    fences.push(new PipeX({ position: [padding, height - padding - 1] }));
    fences.push(new PipeX({ position: [width - padding - 1, height - padding - 1] }));
}

const _position = new Vector2();
fences = fences.filter(x => !x.getWorldPosition(_position).equals(new Vector2(9, 2)) && !x.getWorldPosition(_position).equals(new Vector2(10, 2)));

const elements: Object2D[] = [
    new Lever({ position: [9, 4] }),
    new Pipe({ position: [9, 3] }).rotate(),
    new PipeX({ position: [9, 2] }),
    new Invertor({ position: [10, 2] }).rotate(Rotations.back),
];

const doors = [
    door('signal_lights', { position: [9, 9] }),
];

const objects = [...fences, ...doors, ...elements];
export const signalLightsLevel = new class extends Level{ 
    constructor() {
        super('signalLights', objects, Tiles.createEmpty(new Vector2(width, height)));
        this.weather.wind = new Vector2(1, 1);
    }
}();