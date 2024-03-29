import { Vector2 } from "../../math/Vector2";
import { Object2D } from "../Object2D";
import { Particle } from "../Particle";

const _position = new Vector2();

export class ParticlesObject extends Object2D {

    constructor() {
        super();
        this.type = "particles";
    }

    update(ticks: number): void {
        super.update(ticks);

        for (const particle of this.children) {
            particle.update(ticks);
        }
    }

    public getParticleAt(position: Vector2) {
        const child = this.children.find(p => p.getWorldPosition(_position).equals(position));
        return child ? child as Particle : undefined;
    }

    public tryAddParticle(particle: Particle): boolean {
        const existingParticle = this.getParticleAt(particle.getWorldPosition(_position));
        if (existingParticle) {
            this.remove(existingParticle);
        }

        this.add(particle);
        return true;
    }
    
    public isParticlePositionBlocked(position: Vector2) {
        return !!this.getParticleAt(position);
    }
}
