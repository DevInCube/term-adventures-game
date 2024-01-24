import { Scene } from "../../../engine/Scene";
import { Faces } from "../../../engine/data/Face";
import { Vector2 } from "../../../engine/data/Vector2";
import { Particle } from "../../../engine/objects/Particle";
import { darkSmokeSprite } from "../../sprites/darkSmokeSprite";

export class DarkSmoke extends Particle {
    static ParticleType = "dark_smoke";

    constructor(position: Vector2, state: number = 0) {
        super(darkSmokeSprite, position, state);
        this.type = DarkSmoke.ParticleType;
    }

    protected onNext(scene: Scene): void {
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
            const particle = scene.getParticleAt(newPosition);
            if (!particle) {
                scene.tryAddParticle(new DarkSmoke(newPosition, newState));
            } else if (particle.type === DarkSmoke.ParticleType && particle.state > newState) {
                scene.removeParticle(particle);
                scene.tryAddParticle(new DarkSmoke(newPosition, newState));
            } else {
                scene.tryAddParticle(new DarkSmoke(newPosition, newState));
            }
        }
    }
}
