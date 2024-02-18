import { Object2D } from "./Object2D";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { TileCategory } from "./TileCategory";
import { Particle } from "./Particle";
import { Vector2 } from "../math/Vector2";
import { CompositeObjectSkin } from "../components/CompositeObjectSkin";
import { Effect } from "../effects/Effect";
import { MudSlownessEffect, SnowSlownessEffect } from "../effects/SlownessEffect";
import { stringHash } from "../../utils/hash";
import { createRandom32 } from "../../utils/random";
import { Lazy } from "../../utils/Lazy";
import { isNotNullable } from "../../utils/typing";
import { Sprite } from "../data/Sprite";

const _position = new Vector2();

export class Tile extends Object2D {
    private static maxSnowLevel = 4;
    private static maxMudLevel = 4;

    private _originalSkin: ObjectSkin;
    public category: TileCategory;
    _maxSnowVariant;
    _maxMudVariant;
    public snowLevel: number = 0;
    private snowTicks: number = 0;
    private mudLevel: number = 0;
    private mudTicks: number = 0;
    public isDisturbed: boolean;
    public disturbanceLevel: number = 0;
    private disturbanceTicks: number = 0;
    disturbanceMaxValue: number = 0;
    effects: Effect[];
    disturbanceSprite: Sprite | undefined;

    constructor(
        skin: ObjectSkin,
        position: Vector2) {

        super(Vector2.zero, skin, new ObjectPhysics(), position);
        this.renderOrder = -1;
        this._originalSkin = skin;

        this._maxSnowVariant = new Lazy<string>(() => {
            const snowVariants = [' ', ' ', '︵', '𓂃'];
            const snowVariant = createRandom32(this.getSeed("snow"))() * snowVariants.length | 0;
            return snowVariants[snowVariant];
        });
        this._maxMudVariant = new Lazy<string>(() => {
            const mudVariants = [' ', '࿔', '🌫', '⛆'];
            const mudVariant = createRandom32(this.getSeed("mud"))() * mudVariants.length | 0;
            return mudVariants[mudVariant];
        });

        // TODO: disable tile world matrix auto update.
    }

    update(ticks: number) {
        super.update(ticks);

        if (this.category === "solid") {
            this.snowTicks = Object2D.updateValue(this.snowTicks, ticks, 3000, () => {
                const temp = this.parent!.scene!.weather.getWeatherInfoAt(this.getWorldPosition(_position)).temperature;
                if (temp >= 8) {
                    this.decreaseSnow();
                    //this.increaseMud();
                }
            });
            this.mudTicks = Object2D.updateValue(this.mudTicks, ticks, 3000, () => {
                const temp = this.parent!.scene!.weather.getWeatherInfoAt(this.getWorldPosition(_position)).temperature;
                if (temp >= 8) {
                    this.decreaseMud();
                    // TODO: increase moisture.
                }
            });
        }
        
        if (this.isDisturbed) {
            this.disturbanceTicks = Object2D.updateValue(this.disturbanceTicks, ticks, 200, () => {
                this.disturbanceLevel = Object2D.updateValue(this.disturbanceLevel, 1, this.disturbanceMaxValue, () => {
                    this.isDisturbed = false;
                });
            });
        }

        this.updateSkin();
    }

    public increaseMud() {
        if (this.category !== "solid" || this.mudLevel >= Tile.maxMudLevel) {
            return;
        }

        this.mudLevel += 1;

        this.removeMudEffect();
        this.addMudEffect();
    }

    public decreaseMud() {
        if (this.category !== "solid") {
            return;
        }

        this.removeMudEffect();
        if (this.mudLevel === 0) {
            return;
        }

        this.mudLevel -= 1;

        this.addMudEffect();
    }

    private removeMudEffect() {
        const index = this.effects.findIndex(x => "isMud" in x);
        if (index !== -1) {
            this.effects.splice(index, 1);
        }
    }

    private addMudEffect() {
        if (this.mudLevel === 0) {
            return;
        }

        const mudEffect = new MudSlownessEffect(0.1 * this.mudLevel);
        this.effects.push(mudEffect);
    }

    public increaseSnow() {
        if (this.category !== "solid" || this.snowLevel >= Tile.maxSnowLevel) {
            return;
        }

        this.snowLevel += 1;

        this.removeSnowEffect();
        this.addSnowEffect();
    }

    public decreaseSnow() {
        if (this.category !== "solid") {
            return;
        }

        this.removeSnowEffect();
        if (this.snowLevel === 0) {
            return;
        }

        this.snowLevel -= 1;

        this.addSnowEffect();
    }

    private removeSnowEffect() {
        const index = this.effects.findIndex(x => "isSnow" in x);
        if (index !== -1) {
            this.effects.splice(index, 1);
        }
    }

    private addSnowEffect() {
        if (this.snowLevel === 0) {
            return;
        }

        const snowEffect = new SnowSlownessEffect(0.1 * this.snowLevel);
        this.effects.push(snowEffect);
    }

    public addSoftDisturbance() {
        if (this.category !== "liquid") {
            return;
        }

        this.isDisturbed = true;
    }

    public addHardDisturbance() {
        if (this.category === "solid" && (this.snowLevel > 0 || this.mudLevel > 0)) {
            return;
        }

        this.isDisturbed = true;
    }

    private updateSkin() {
        const tileEffect = this.getTileEffect();
        this.skin = tileEffect
            ? new CompositeObjectSkin([this._originalSkin, tileEffect])
            : this._originalSkin;
    }

    getSeed(propertyName: string) {
        const fullName = `${this.scene!.name}.${propertyName}`;
        const positionVal = this.position.x + this.position.y * 10000;
        const val = stringHash(fullName) ^ positionVal;
        return val;
    }

    getTileOverlayFrame() {
        const tile = this;
        if (tile.category === "solid") { 
            if (tile.snowLevel > 0) {
                const snowColor = `#fff${(tile.snowLevel * 2).toString(16)}`;
                const frame = new ObjectSkin().background(snowColor);
                if (tile.snowLevel === Tile.maxSnowLevel) {
                    frame.char(this._maxSnowVariant.value).color('gray');
                }

                return frame;
            }

            if (tile.mudLevel > 0) {
                const mudColor = `#000${(tile.mudLevel).toString(16)}`;
                const frame = new ObjectSkin().background(mudColor);
                if (tile.mudLevel === Tile.maxMudLevel) {
                    frame.char(this._maxMudVariant.value).color(`#0ff${2}`);
                }

                return frame;
            }
        }

        return undefined;
    }
    
    getTileDisturbanceFrame() {
        if (!this.isDisturbed || !this.disturbanceSprite) {
            return undefined;
        }

        const index = this.disturbanceLevel % this.disturbanceMaxValue;
        return this.disturbanceSprite.frames[Particle.defaultFrameName][index];
    }

    getTileEffect(): ObjectSkin | undefined {
        const frames = [this.getTileOverlayFrame(), this.getTileDisturbanceFrame()]
            .filter(isNotNullable);
        if (frames.length === 0) {
            return undefined;
        }

        if (frames.length === 1) {
            return frames[0];
        }

        return new CompositeObjectSkin(frames);
    }
}
