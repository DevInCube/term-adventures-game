import { clamp } from "../../utils/math";
import { Color } from "../math/Color";
import { NormalRotation } from "../math/Rotation";
import { Vector2 } from "../math/Vector2";

// TODO: remove later when lights are processed in renderer (with Light class).
export type LightInfo = {
    position: Vector2,
    color: Color,
    intensity: number,
};

export type TemperatureInfo = {
    position: Vector2,
    temperature: number,
};

export type MaterialInfo = {
    position: Vector2,
    opacity: number,
};

export type SignalCellInfo = {
    position: Vector2;
    inputs: NormalRotation[];
    outputs: NormalRotation[];
};

export class ObjectPhysics {
    public collisions: Vector2[] = [];
    public lights: LightInfo[] = [];
    public temperatures: TemperatureInfo[] = [];
    public materials: MaterialInfo[] = [];
    public signalCells: SignalCellInfo[] = [];

    constructor() {

    }

    public collision(position: Vector2 = new Vector2()) {
        const collision = this.collisions.find(x => x.equals(position));
        if (!collision) {
            this.collisions.push(position);
        }
        
        this.material({ position, opacity: 1});
        return this;
    }

    public light(options: number | string | LightInfo) {
        if (typeof options === "number") {
            this.light({ position: new Vector2(), intensity: options, color: new Color(1, 1, 1) });
        } else if (typeof options === "string") {
            const number = Number.parseInt(options, 16);
            this.light(number);
        } else {
            const light = this.lights.find(x => x.position.equals(options.position));
            if (light) {
                light.color = options.color;
                light.intensity = options.intensity;
            } else {
                this.lights.push(options);
            }
        }

        return this;
    }

    public temperature(options: number | string | TemperatureInfo) {
        if (typeof options === "number") {
            this.temperature({ position: new Vector2(), temperature: options });
        }  else if (typeof options === "string") {
            const number = Number.parseInt(options, 16);
            this.temperature(number);
        }  else {
            const temperature = this.temperatures.find(x => x.position.equals(options.position));
            if (temperature) {
                temperature.temperature = options.temperature;
            } else {
                this.temperatures.push(options);
            }
        }

        return this;
    }

    public material(options: number | string | MaterialInfo) {
        if (typeof options === "number") {
            this.material({ position: new Vector2(), opacity: options });
        } else if (typeof options === "string") {
            const number = clamp(Number.parseInt(options, 16) / 15, 0, 1);
            this.material(number);
        } else {
            const material = this.materials.find(x => x.position.equals(options.position));
            if (material) {
                material.opacity = options.opacity;
            } else {
                this.materials.push(options);
            }
        }

        return this;
    }

    public signal(options: SignalCellInfo) {
        const signalCell = this.signalCells.find(x => x.position.equals(options.position));
        if (signalCell) {
            signalCell.outputs = options.outputs;
            signalCell.inputs = options.inputs;
        } else {
            this.signalCells.push(options);
        }

        return this;
    }
};
