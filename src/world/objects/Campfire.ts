import { GameEvent } from "../../engine/GameEvent";
import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { StaticGameObject } from "../../engine/StaticGameObject";

export class Campfire extends StaticGameObject {
    constructor() {
        super([0, 0], new ObjectSkin(`🔥`, `V`, {
            V: ['red', 'transparent'],
        }), new ObjectPhysics(` `, 'F', 'F'), [10, 10]);
    }

    new() { return new Campfire(); }

    handleEvent(ev: GameEvent) {
        super.handleEvent(ev);
        //
        if (ev.type === 'weather_changed') {
            if (ev.args["to"] == 'rain') {
                this.skin.grid[0][0] = `💨`;
                this.physics.lights[0] = `6`;
                this.physics.temperatures[0] = `8`;
            }
            else if (ev.args["to"] == 'rain_and_snow') {
                this.skin.grid[0][0] = `🔥`;
                this.physics.lights[0] = `A`;
                this.physics.temperatures[0] = `A`;
            }
            else {
                this.skin.grid[0][0] = `🔥`;
                this.physics.lights[0] = `F`;
                this.physics.temperatures[0] = `F`;
            }
        }
    }
}