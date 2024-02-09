import { Object2D } from "./Object2D";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { TileCategory } from "./TileCategory";
import { waterRippleSprite } from "../../world/sprites/waterRippleSprite";
import { Particle } from "./Particle";
import { Vector2 } from "../math/Vector2";
import { CompositeObjectSkin } from "../components/CompositeObjectSkin";

const _position = new Vector2();

export class Tile extends Object2D {
    private static maxSnowLevel = 4;

    private _originalSkin: ObjectSkin;
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
        this.renderOrder = -1;
        this._originalSkin = skin;
    }

    update(ticks: number) {
        super.update(ticks);

        if (this.category === "solid") {
            this.snowTicks += Object2D.updateValue(this.snowTicks, ticks, 3000, () => {
                const temp = this.parent!.scene!.weather.getWeatherInfoAt(this.getWorldPosition(_position)).temperature;
                if (temp >= 8) {
                    this.decreaseSnow();
                }
            });
        } else if (this.category === "liquid" && this.isDisturbed) {
            this.disturbanceTicks = Object2D.updateValue(this.disturbanceTicks, ticks, 200, () => {
                this.disturbanceLevel = Object2D.updateValue(this.disturbanceLevel, 1, this.disturbanceMaxValue, () => {
                    this.isDisturbed = false;
                });
            });
        }

        this.updateSkin();
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

    private updateSkin() {
        const tileEffect = this.getTileEffect();
        this.skin = tileEffect ? new CompositeObjectSkin([this._originalSkin, tileEffect]) : this._originalSkin;
    }

    getTileEffect(): ObjectSkin | undefined {
        const tile = this;
        if (tile.category === "solid" && tile.snowLevel > 0) {
            const snowColor = `#fff${(tile.snowLevel * 2).toString(16)}`;
            const frame = new ObjectSkin().background(snowColor);
            return frame;
        }

        if (tile.category === "liquid" && tile.isDisturbed) {
            const frame = waterRippleSprite.frames[Particle.defaultFrameName][tile.disturbanceLevel];
            return frame;
        }

        return undefined;
    }
}
