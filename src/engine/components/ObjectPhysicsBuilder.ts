import { clamp } from "../../utils/math";
import { Color } from "../math/Color";
import { Vector2 } from "../math/Vector2";
import { MaterialInfo, TemperatureInfo, LightInfo, ObjectPhysics } from "./ObjectPhysics";

export class ObjectPhysicsBuilder {

    public collisions: (string)[];
    public lights: (string)[];
    public temperatures: (string)[];
    public opacity: (string)[];
    public lightsMap: { [key: string]: { intensity: string; color: Color; }; } | undefined;

    constructor(
        collisionsMask: string = '',
        lightMask: string = '',
        temperatureMask: string = '',
        topMask: string = '',
        opacityMask: string = '') {

        this.collisions = collisionsMask.split('\n');
        this.lights = lightMask.split('\n');
        this.temperatures = temperatureMask.split('\n');
        this.opacity = opacityMask !== ''
            ? opacityMask.split('\n')
            : this.collisions.map(line => line.split('').map(x => x === '.' ? 'F' : '0').join(''));
    }

    public build(): ObjectPhysics {
        const physics = new ObjectPhysics();
        physics.materials = this.getMaterials();
        physics.temperatures = this.getTemperatures();
        physics.lights = this.getLights();

        for (let y = 0; y < this.collisions.length; y++) {
            for (let x = 0; x < this.collisions[y].length; x++) {
                if ((this.collisions[y][x] || ' ') === ' ') {
                    continue;
                }

                const cellPos = new Vector2(x, y);
                physics.collisions.push(cellPos);
            }
        }
        
        return physics;
    }

    private getMaterials(): MaterialInfo[] {
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

    private getTemperatures(): TemperatureInfo[] {
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

    private getLights(): LightInfo[] {
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

    private getLight(char: string): { color: Color; intensity: number; } {
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
