import { clamp } from "../../utils/math";
import { Color } from "../math/Color";
import { Vector2 } from "../math/Vector2";
import { SignalCell } from "./SignalCell";

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

// TODO: rename this to ObjectPhysicsBuilder and create ObjectPhysics class.
export class ObjectPhysics {

    public collisions: (string)[];
    public lights: (string)[];
    public temperatures: (string)[];
    public tops: (string)[];
    public opacity: (string)[];
    public lightsMap: { [key: string]: { intensity: string, color: Color, } } | undefined;
    public signalCells: SignalCell[] = [];

    constructor(
        collisionsMask: string = '', 
        lightMask: string = '',
        temperatureMask: string = '',
        topMask: string = '',
        opacityMask: string = '') {

        this.collisions = collisionsMask.split('\n');
        this.lights = lightMask.split('\n');
        this.temperatures = temperatureMask.split('\n');
        this.tops = topMask.split('\n');
        this.opacity = opacityMask !== '' 
            ? opacityMask.split('\n')
            : this.collisions.map(line => line.split('').map(x => x === '.' ? 'F' : '0').join(''));
    }

    public getMaterials(): MaterialInfo[] {
        const materials: MaterialInfo[] = [];
        for (const [top, string] of this.opacity.entries()) {
            for (const [left, char] of string.split('').entries()) {
                if (!char) {
                    continue;
                }

                const opacity = clamp(Number.parseInt(char, 16) / 15, 0, 1);
                const position = new Vector2(left, top);
                
                materials.push({ position, opacity });
            }
        }

        return materials;
    }

    public getTemperatures(): TemperatureInfo[] {
        const temperatures: TemperatureInfo[] = [];
        for (const [top, string] of this.temperatures.entries()) {
            for (const [left, char] of string.split('').entries()) {
                if (char === '') {
                    continue;
                }

                const temperature = Number.parseInt(char, 16);
                const position = new Vector2(left, top);
                
                temperatures.push({ position, temperature });
            }
        }

        return temperatures;
    }

    // TODO: remove this after objects will use Light objects as their children.
    public getLights(): LightInfo[] {
        const lights: LightInfo[] = [];
        for (const [top, string] of this.lights.entries()) {
            for (let [left, char] of string.split('').entries()) {
                if (char === '') {
                    continue;
                }
                
                const light = this.getLight(char);
                if (light.intensity === 0) {
                    continue;
                }

                const position = new Vector2(left, top);
                lights.push({ position: position, color: light.color, intensity: light.intensity });
            }
        }

        return lights;
    }
    
    private getLight(char: string): { color: Color, intensity: number } {
        let color: Color = new Color(1, 1, 1);
        if (this.lightsMap) {
            const record = this.lightsMap[char];
            char = record.intensity;
            color = record.color;
        }

        const intensity = Number.parseInt(char, 16);
        return { color, intensity };
    }
}