import { SceneObject } from "./SceneObject";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { TileCategory } from "./TileCategory";
import { Scene } from "../Scene";
import { waterRippleSprite } from "../../world/sprites/waterRippleSprite";
import { Particle } from "./Particle";
import { Vector2 } from "../data/Vector2";

export class Tile extends SceneObject {
    private static maxSnowLevel = 4;

    public category: TileCategory;
    public movementPenalty: number = 1;
    public snowLevel: number = 0;
    private snowTicks: number = 0;
    public isDisturbed: boolean;
    public disturbanceLevel: number = 0;
    private disturbanceTicks: number = 0;
    private disturbanceMaxValue: number = waterRippleSprite.frames[Particle.defaultFrameName].length;

    get totalMovementPenalty(): number {
        return this.movementPenalty * (1 - 0.1 * this.snowLevel);
    }

    constructor(
        skin: ObjectSkin,
        position: Vector2) {

        super(Vector2.zero, skin, new ObjectPhysics(), position);
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);

        if (this.category === "solid") {
            this.snowTicks += SceneObject.updateValue(this.snowTicks, ticks, 3000, () => {
                const temp = scene.getTemperatureAt(this.position);
                if (temp >= 8) {
                    this.decreaseSnow();
                }
            });
        } else if (this.category === "liquid" && this.isDisturbed) {
            this.disturbanceTicks = SceneObject.updateValue(this.disturbanceTicks, ticks, 200, () => {
                this.disturbanceLevel = SceneObject.updateValue(this.disturbanceLevel, 1, this.disturbanceMaxValue, () => {
                    this.isDisturbed = false;
                });
            });
        }
    }

    increaseSnow() {
        if (this.category !== "solid" || this.snowLevel >= Tile.maxSnowLevel) {
            return;
        }

        this.snowLevel += 1;
    }

    decreaseSnow() {
        if (this.category !== "solid" || this.snowLevel === 0) {
            return;
        }

        this.snowLevel -= 1;
    }

    addDisturbance() {
        if (this.category !== "liquid") {
            return;
        }

        this.isDisturbed = true;
    }
}
