import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Scene } from "../../engine/Scene";
import { Smoke } from "./particles/Smoke";

export class Campfire extends StaticGameObject {
    private smokeTicks: number = 0;

    constructor(position: [number, number]) {
        super([0, 0], new ObjectSkin(`🔥`, `V`, {
            V: ['red', 'transparent'],
        }), new ObjectPhysics(` `, 'F', 'F'),
        position);
        
        this.type = "campfire";
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);

        const isRainyWeather = 
            scene.level.weatherType === 'rain' ||
            scene.level.weatherType === 'rain_and_snow';
        const [x, y] = this.position;
        const isUnderTheSky = scene.isRoofHoleAt(this.position);
        if (isRainyWeather && isUnderTheSky) {
            this.skin.grid[0][0] = `💨`;
            this.physics.lights[0] = `6`;
            this.physics.temperatures[0] = `8`;
        } else {
            this.skin.grid[0][0] = `🔥`;
            this.physics.lights[0] = `F`;
            this.physics.temperatures[0] = `F`;

            this.smokeTicks += ticks;
            const smokeTicksOverflow = this.smokeTicks - 2000;
            if (smokeTicksOverflow >= 0) {
                const _ = this.scene!.tryAddParticle(new Smoke([x, y]));
                this.smokeTicks = smokeTicksOverflow;
            }
        }
    }
}

export function campfire(options: { position: [number, number] }) {
    return new Campfire(options.position);
}