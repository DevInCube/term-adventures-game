import { Scene } from "../Scene";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Vector2 } from "../math/Vector2";
import { Sprite } from "../data/Sprite";
import { Object2D } from "./Object2D";

export class Particle extends Object2D {
    static defaultFrameName = 'particle';
    
    private decayTicks: number = 0;

    constructor(
        private sprite: Sprite,
        position: Vector2,
        public state: number,
        private options: {
            decaySpeed?: number,
        } = {
            decaySpeed: 1000,
        }
    ) {
        const initialFrame = Particle.getFrameSkinAt(sprite, state);
        super(Vector2.zero, initialFrame, new ObjectPhysics(), position);
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);

        if (this.options.decaySpeed) {
            this.decayTicks += ticks;
            const decayTicksOverflow = this.decayTicks - this.options.decaySpeed;
            if (decayTicksOverflow >= 0) {
                if (!this.hasNext()) {
                    this.onRemove(scene);
                } else {
                    this.next();
                    this.onNext(scene);
                }
    
                this.decayTicks = decayTicksOverflow;
            }
        }
    }

    protected onNext(scene: Scene) {
    }

    protected onRemove(scene: Scene) {
        scene.removeParticle(this);
    }

    public next() {
        const frame = this.sprite.frames[Particle.defaultFrameName];
        this.state = (this.state + 1) % frame.length;
        this.skin = Particle.getFrameSkinAt(this.sprite, this.state);
    }

    public hasNext() {
        const frame = this.sprite.frames[Particle.defaultFrameName];
        return this.state < frame.length - 1;
    }

    public reset() {
        this.state = 0;
        this.skin = Particle.getFrameSkinAt(this.sprite, this.state);
    }

    static getFrameSkinAt(sprite: Sprite, index: number) {
        const frame = sprite.frames[Particle.defaultFrameName];
        return frame[index % frame.length];
    }
}
