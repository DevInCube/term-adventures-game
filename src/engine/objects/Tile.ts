import { Object2D } from "./Object2D";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { TileCategory } from "./TileCategory";
import { Vector2 } from "../math/Vector2";
import { CompositeObjectSkin } from "../components/CompositeObjectSkin";
import { Effect } from "../effects/Effect";
import { MudSlownessEffect, SandSlownessEffect, SnowSlownessEffect } from "../effects/SlownessEffect";
import { stringHash } from "../../utils/hash";
import { createRandom32 } from "../../utils/random";
import { Lazy } from "../../utils/Lazy";
import { isNotNullable } from "../../utils/typing";
import { SpriteAnimation } from "./SpriteAnimation";
import { Color } from "../math/Color";
import { Colors } from "../math/Colors";

const _position = new Vector2();

export class Tile extends Object2D {
    private static maxSnowLevel = 4;
    private static maxMudLevel = 4;
    public static maxSandLevel = 4;

    private _originalSkin: ObjectSkin;
    public category: TileCategory;
    _maxSnowVariant;
    _maxMudVariant;
    _maxSandVariant;
    public snowLevel: number = 0;
    private snowTicks: number = 0;
    private mudLevel: number = 0;
    private mudTicks: number = 0;
    public sandLevel: number = 0;
    private sandTicks: number = 0;
    effects: Effect[];
    disturbanceAnimation: SpriteAnimation | undefined;

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
        this._maxSandVariant = new Lazy<string>(() => {
            const sandVariants = [' ', ' ', '︵', '𓂃'];
            const sandVariant = createRandom32(this.getSeed("sand"))() * sandVariants.length | 0;
            return sandVariants[sandVariant];
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
            this.sandTicks = Object2D.updateValue(this.sandTicks, ticks, 3000, () => {
                // TODO: fluctuate with wind? or move in the direction of wind?
            });
        }
        
        this.disturbanceAnimation?.update(ticks);

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

    private addSandEffect() {
        if (this.sandLevel === 0) {
            return;
        }

        const sandEffect = new SandSlownessEffect(0.1 * this.sandLevel);
        this.effects.push(sandEffect);
    }

    public setSandLevel(level: number) {
        if (this.category !== "solid") {
            return this;
        }

        this.sandLevel = level;
        this.addSandEffect();
        return this;
    }

    public addSoftDisturbance() {
        if (this.category !== "liquid") {
            return;
        }

        this.disturbanceAnimation?.play();
    }

    public addHardDisturbance() {
        if (this.category === "solid" && 
            (this.snowLevel > 0 || this.mudLevel > 0 || this.sandLevel > 0)
        ) {
            return;
        }

        this.disturbanceAnimation?.play();
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
                const frame = new ObjectSkin().background(Color.fromHexString(snowColor));
                if (tile.snowLevel === Tile.maxSnowLevel) {
                    frame.char(this._maxSnowVariant.value).color(Colors.Gray);
                }

                return frame;
            }

            if (tile.mudLevel > 0) {
                const mudColor = `#000${(tile.mudLevel).toString(16)}`;
                const frame = new ObjectSkin().background(Color.fromHexString(mudColor));
                if (tile.mudLevel === Tile.maxMudLevel) {
                    frame.char(this._maxMudVariant.value).color(Color.fromHexString(`#0ff${2}`));
                }

                return frame;
            }

            if (tile.sandLevel > 0) {
                const sandColor = `#640${(tile.sandLevel * 2).toString(16)}`;
                const frame = new ObjectSkin().background(Color.fromHexString(sandColor));
                if (tile.sandLevel === Tile.maxSandLevel) {
                    frame.char(this._maxSandVariant.value).color(Colors.Black);
                }

                return frame;
            }
        }

        return undefined;
    }
    
    getTileDisturbanceFrame() {
        if (!this.disturbanceAnimation?.isPlaying) {
            return undefined;
        }

        return this.disturbanceAnimation?.getFrame();
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
