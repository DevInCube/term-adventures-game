import { Scene } from "../Scene";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Sprite } from "../data/Sprite";
import { SceneObject } from "./SceneObject";

export class Particle extends SceneObject {
    static defaultFrameName = 'particle';
    
    private decayTicks: number = 0;

    constructor(
        private sprite: Sprite,
        position: [number, number],
        public state: number,
        private options: {
            decaySpeed?: number,
        } = {
            decaySpeed: 1000,
        }
    ) {
        const initialFrame = Particle.getFrameSkinAt(sprite, state);
        super([0, 0], initialFrame, new ObjectPhysics(), position);
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
