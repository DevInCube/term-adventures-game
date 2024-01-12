import { ObjectPhysics } from "../components/ObjectPhysics";
import { Sprite } from "../data/Sprite";
import { StaticGameObject } from "./StaticGameObject";

export class Particle extends StaticGameObject {
    static defaultFrameName = 'particle';
    
    constructor(
        private sprite: Sprite,
        position: [number, number],
        public state: number
    ) {
        const initialFrame = Particle.getFrameSkinAt(sprite, state);
        super([0, 0], initialFrame, new ObjectPhysics(), position);
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
