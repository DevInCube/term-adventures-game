import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { Scene } from "../../engine/Scene";

export class Campfire extends StaticGameObject {
    constructor() {
        super([0, 0], new ObjectSkin(`🔥`, `V`, {
            V: ['red', 'transparent'],
        }), new ObjectPhysics(` `, 'F', 'F'));
    }

    new() { return new Campfire(); }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);

        const isRainyWeather = 
            scene.level.weatherType === 'rain' ||
            scene.level.weatherType === 'rain_and_snow';
        const [x, y] = this.position;
        const isUnderTheSky = scene.level.roofHolesLayer[y] && scene.level.roofHolesLayer[y][x];
        if (isRainyWeather && isUnderTheSky) {
            this.skin.grid[0][0] = `💨`;
            this.physics.lights[0] = `6`;
            this.physics.temperatures[0] = `8`;
        } else {
            this.skin.grid[0][0] = `🔥`;
            this.physics.lights[0] = `F`;
            this.physics.temperatures[0] = `F`;
        }
    }
}