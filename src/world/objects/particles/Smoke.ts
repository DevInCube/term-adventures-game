import { Scene } from "../../../engine/Scene";
import { Particle } from "../../../engine/objects/Particle";
import { smokeSprite } from "../../sprites/smokeSprite";

export class Smoke extends Particle {
    static ParticleType = "smoke";

    private decayTicks: number = 0;

    constructor(position: [number, number], state: number = 0) {
        super(smokeSprite, position, state);
        this.type = Smoke.ParticleType;
    }

    update(ticks: number, scene: Scene) {
        this.decayTicks += ticks;
        const decayTicksOverflow = this.decayTicks - 1000;
        if (decayTicksOverflow >= 0) {
            if (!this.hasNext()) {
                scene.removeParticle(this);
            } else {
                this.next();
                spread(this);
            }

            this.decayTicks = decayTicksOverflow;
        }

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