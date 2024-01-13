import { Scene } from "../../../engine/Scene";
import { Particle } from "../../../engine/objects/Particle";
import { smokeSprite } from "../../sprites/smokeSprite";

export class Smoke extends Particle {
    static ParticleType = "smoke";

    constructor(position: [number, number], state: number = 0) {
        super(smokeSprite, position, state);
        this.type = Smoke.ParticleType;
    }

    protected onNext(scene: Scene): void {
        spread(this);

        function spread(particle: Smoke) {
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
                scene.tryAddParticle(new Smoke(newPosition, newState));
            } else if (particle.type === Smoke.ParticleType && particle.state > newState) {
                scene.removeParticle(particle);
                scene.tryAddParticle(new Smoke(newPosition, newState));
            }
        }
    }
}