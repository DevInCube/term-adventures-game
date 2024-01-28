import { Faces } from "../../../engine/math/Face";
import { Vector2 } from "../../../engine/math/Vector2";
import { Particle } from "../../../engine/objects/Particle";
import { darkSmokeSprite } from "../../sprites/darkSmokeSprite";

export class DarkSmoke extends Particle {
    static ParticleType = "dark_smoke";

    constructor(position: Vector2, state: number = 0) {
        super(darkSmokeSprite, position, state);
        this.type = DarkSmoke.ParticleType;
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
            const newPositions = Faces
                .map(x => Vector2.fromFace(x))
                .map(x => particlePos.clone().add(x));
            for (const newPosition of newPositions) {
                spreadTo(newPosition, newState);
            }
        }

        function spreadTo(newPosition: Vector2, newState: number) {
            const particle = particles.getParticleAt(newPosition);
            if (!particle) {
                particles.tryAddParticle(new DarkSmoke(newPosition, newState));
            } else if (particle.type === DarkSmoke.ParticleType && particle.state > newState) {
                particles.remove(particle);
                particles.tryAddParticle(new DarkSmoke(newPosition, newState));
            } else {
                particles.tryAddParticle(new DarkSmoke(newPosition, newState));
            }
        }
    }
}
