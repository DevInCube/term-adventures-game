import { clamp } from "../../utils/math";
import { Color } from "../math/Color";
import { Vector2 } from "../math/Vector2";
import { ObjectPhysics } from "../components/ObjectPhysics";

export class ObjectPhysicsBuilder {

    public collisions: (string)[];
    public lights: (string)[];
    public temperatures: (string)[];
    public opacity: (string)[];

    constructor(
        collisionsMask: string = '',
        lightMask: string = '',
        temperatureMask: string = '',
        opacityMask: string = '') {

        this.collisions = collisionsMask.split('\n');
        this.lights = lightMask.split('\n');
        this.temperatures = temperatureMask.split('\n');
        this.opacity = opacityMask !== ''
            ? opacityMask.split('\n')
            : this.collisions.map(line => line.split('').map(x => x === '.' ? 'F' : '0').join(''));
    }

    public build(): ObjectPhysics {
        const pipeline = [
            this.setMaterials,
            this.setTemperatures,
            this.setLights,
            this.setCollisions,
        ];
        const physics = pipeline
            .map(x => x.bind(this))
            .reduce((a, x) => a = x(a), new ObjectPhysics());
        
        return physics;
    }

    private setMaterials(physics: ObjectPhysics) {
        for (const [top, string] of this.opacity.entries()) {
            for (const [left, char] of string.split('').entries()) {
                if (!char) {
                    continue;
                }

                const opacity = clamp(Number.parseInt(char, 16) / 15, 0, 1);
                const position = new Vector2(left, top);

                physics.material({ position, opacity });
            }
        }

        return physics;
    }

    private setTemperatures(physics: ObjectPhysics) {
        for (const [top, string] of this.temperatures.entries()) {
            for (const [left, char] of string.split('').entries()) {
                if (char === '') {
                    continue;
                }

                const temperature = Number.parseInt(char, 16);
                const position = new Vector2(left, top);

                physics.temperature({ position, temperature });
            }
        }

        return physics;
    }

    private setLights(physics: ObjectPhysics) {
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
                physics.light({ position: position, color: light.color, intensity: light.intensity });
            }
        }

        return physics;
    }

    private setCollisions(physics: ObjectPhysics) {
        for (let y = 0; y < this.collisions.length; y++) {
            for (let x = 0; x < this.collisions[y].length; x++) {
                if ((this.collisions[y][x] || ' ') === ' ') {
                    continue;
                }

                const cellPos = new Vector2(x, y);
                physics.collision(cellPos);
            }
        }

        return physics;
    }

    private getLight(char: string): { color: Color; intensity: number; } {
        let color: Color = new Color(1, 1, 1);
        const intensity = Number.parseInt(char, 16);
        return { color, intensity };
    }
}
