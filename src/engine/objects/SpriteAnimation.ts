import { Sprite } from "../data/Sprite";
import { Object2D } from "./Object2D";
import { Particle } from "./Particle";


export class SpriteAnimation {

    private _currentFrame: number = 0;
    private _maxFrames: number = 0;
    private _ticks: number = 0;

    public isPlaying: boolean = false;

    constructor(
        private sprite: Sprite,
        private period: number = 200
    ) {
        this._maxFrames = sprite.frames[Particle.defaultFrameName].length;
    }

    play() {
        this.isPlaying = true;
    }

    stop() {
        this.isPlaying = false;
    }

    update(ticks: number) {
        if (!this.isPlaying) {
            return;
        }

        this._ticks = Object2D.updateValue(this._ticks, ticks, this.period, () => {
            this._currentFrame = Object2D.updateValue(this._currentFrame, 1, this._maxFrames, () => {
                this.stop();
            });
        });
    }

    getFrame() {
        const index = this._currentFrame % this._maxFrames;
        return this.sprite.frames[Particle.defaultFrameName][index];
    }
}
