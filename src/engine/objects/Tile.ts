import { SceneObject } from "./SceneObject";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { TileCategory } from "./TileCategory";
import { Scene } from "../Scene";

export class Tile extends SceneObject {
    private static maxSnowLevel = 4;

    public category: TileCategory;
    public movementPenalty: number = 1;
    public snowLevel: number = 0;
    private snowTicks: number = 0;

    get totalMovementPenalty(): number {
        return this.movementPenalty * (1 - 0.1 * this.snowLevel);
    }

    constructor(
        skin: ObjectSkin,
        position: [number, number]) {

        super([0, 0], skin, new ObjectPhysics(), position);
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);

        if (this.category === "solid") {
            this.snowTicks += ticks;
            if (this.snowTicks > 3000) {
                const temp = scene.getTemperatureAt(this.position);
                if (temp < 8) {
                    const isSnowing = scene.getWeatherAt(this.position) === "snow";
                    if (isSnowing && this.snowLevel < Tile.maxSnowLevel) {
                        this.snowLevel += Math.random() * 2 | 0;
                    }
                } else {
                    if (this.snowLevel > 0) {
                        this.snowLevel -= 1;
                    }
                }

                this.snowTicks = 0;
            }
        }
    }
}
