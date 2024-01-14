import { Scene } from "../../../engine/Scene";
import { rainDropSprite } from "../../sprites/rainDropSprite";
import { WeatherParticle } from "./WeatherParticle";

export class Raindrop extends WeatherParticle {
    constructor(position: [number, number], state: number = 0) {
        super(rainDropSprite, position, state);
        this.type = "raindrop";
    }

    protected onRemove(scene: Scene): void {
        super.onRemove(scene);
        const tile = scene.getTileAt(this.position);
        tile?.addDisturbance();
    }
}
