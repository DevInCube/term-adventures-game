import { Object2D } from "./Object2D";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { TileCategory } from "./TileCategory";
import { waterRippleSprite } from "../../world/sprites/waterRippleSprite";
import { Particle } from "./Particle";
import { Vector2 } from "../math/Vector2";
import { CompositeObjectSkin } from "../components/CompositeObjectSkin";
import { Effect, MudSlownessEffect, SlownessEffect, SnowSlownessEffect } from "../effects/Effect";

const _position = new Vector2();

export class Tile extends Object2D {
    private static maxSnowLevel = 4;
    private static maxMudLevel = 4;

    private _originalSkin: ObjectSkin;
    public category: TileCategory;
    public movementPenalty: number = 1;
    private _maxSnowVariant: number = 0;
    private _maxMudVariant: number = 0;
    public snowLevel: number = 0;
    private snowTicks: number = 0;
    private mudLevel: number = 0;
    private mudTicks: number = 0;
    public isDisturbed: boolean;
    public disturbanceLevel: number = 0;
    private disturbanceTicks: number = 0;
    private disturbanceMaxValue: number = waterRippleSprite.frames[Particle.defaultFrameName].length;
    private _solidImmediateEffects: Effect[] = [];
    private _liquidImmediateEffects: Effect[] = [new SlownessEffect("water", this.movementPenalty)];
    private _elevatedImmediateEffects: Effect[] = [];

    public getEffects(): Effect[] {
        if (this.category === "solid") {
            return this._solidImmediateEffects;
        } else if (this.category === "liquid") {
            return this._liquidImmediateEffects;
        } else {
            return this._elevatedImmediateEffects;
        }
    }

    constructor(
        skin: ObjectSkin,
        position: Vector2) {

        super(Vector2.zero, skin, new ObjectPhysics(), position);
        this.renderOrder = -1;
        this._originalSkin = skin;

        this._maxSnowVariant = Math.random() * 4 | 0;
        this._maxMudVariant = Math.random() * 4 | 0;

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
        } else if (this.category === "liquid" && this.isDisturbed) {
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
        const index = this._solidImmediateEffects.findIndex(x => "isMud" in x);
        if (index !== -1) {
            this._solidImmediateEffects.splice(index, 1);
        }
    }

    private addMudEffect() {
        if (this.mudLevel === 0) {
            return;
        }

        const value = this.movementPenalty * (1 - 0.1 * this.mudLevel);
        const mudEffect = new MudSlownessEffect(value);
        this._solidImmediateEffects.push(mudEffect);
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
        const index = this._solidImmediateEffects.findIndex(x => "isSnow" in x);
        if (index !== -1) {
            this._solidImmediateEffects.splice(index, 1);
        }
    }

    private addSnowEffect() {
        if (this.snowLevel === 0) {
            return;
        }

        const value = this.movementPenalty * (1 - 0.1 * this.snowLevel);
        const snowEffect = new SnowSlownessEffect(value);
        this._solidImmediateEffects.push(snowEffect);
    }

    public addDisturbance() {
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
        if (tile.category === "solid") { 
            if (tile.snowLevel > 0) {
                const snowColor = `#fff${(tile.snowLevel * 2).toString(16)}`;
                const frame = new ObjectSkin().background(snowColor);
                if (tile.snowLevel === Tile.maxSnowLevel) {
                    const char = [' ', ' ', '︵', '𓂃'][this._maxSnowVariant];
                    frame.char(char).color('gray');
                }

                return frame;
            }

            if (tile.mudLevel > 0) {
                const mudColor = `#000${(tile.mudLevel).toString(16)}`;
                const frame = new ObjectSkin().background(mudColor);
                if (tile.mudLevel === Tile.maxMudLevel) {
                    const char = [' ', '࿔', '🌫', '⛆'][this._maxMudVariant];
                    frame.char(char).color(`#0ff${2}`);
                }

                return frame;
            }
        }

        if (tile.category === "liquid" && tile.isDisturbed) {
            const frame = waterRippleSprite.frames[Particle.defaultFrameName][tile.disturbanceLevel];
            return frame;
        }

        return undefined;
    }
}
