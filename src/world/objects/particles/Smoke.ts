import { Vector2 } from "../../../engine/math/Vector2";
import { Particle } from "../../../engine/objects/Particle";
import { smokeSprite } from "../../sprites/smokeSprite";

export class Smoke extends Particle {
    static ParticleType = "smoke";

    constructor(position: Vector2, state: number = 0) {
        super(smokeSprite, position, state);
        this.type = Smoke.ParticleType;
    }

    protected onNext(): void {
        const scene = this.parent?.scene!;
        const particles = scene.particlesObject;
        spread(this);

        function spread(particle: Particle) {
            if (!particle.hasNext()) {
                return;
            }

            const particlePos = particle.position;
            const newState = particle.state + 1;
            const newPositions = Vector2.directions
                .map(x => particlePos.clone().add(x));
            for (const newPosition of newPositions) {
                spreadTo(newPosition, newState);
            }
        }

        function spreadTo(newPosition: Vector2, newState: number) {
            const particle = particles.getParticleAt(newPosition);
            if (!particle) {
                particles.tryAddParticle(new Smoke(newPosition, newState));
            } else if (particle.type === Smoke.ParticleType && particle.state > newState) {
                particles.remove(particle);
                particles.tryAddParticle(new Smoke(newPosition, newState));
            }
        }
    }
}
