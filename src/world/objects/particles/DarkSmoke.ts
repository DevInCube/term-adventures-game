import { Scene } from "../../../engine/Scene";
import { Particle } from "../../../engine/objects/Particle";
import { darkSmokeSprite } from "../../sprites/darkSmokeSprite";

export class DarkSmoke extends Particle {
    static ParticleType = "dark_smoke";

    constructor(position: [number, number], state: number = 0) {
        super(darkSmokeSprite, position, state);
        this.type = DarkSmoke.ParticleType;
    }

    protected onNext(scene: Scene): void {
        spread(this);

        function spread(particle: Particle) {
            if (!particle.hasNext()) {
                return;
            }

            const [x, y] = particle.position;
            const newState = particle.state + 1;
            spreadTo([x + 1, y + 0], newState);
            spreadTo([x - 1, y - 0], newState);
            spreadTo([x + 0, y + 1], newState);
            spreadTo([x - 0, y - 1], newState);
        }

        function spreadTo(newPosition: [number, number], newState: number) {
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
