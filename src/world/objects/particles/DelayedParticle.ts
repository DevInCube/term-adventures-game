import { Vector2 } from "../../../engine/math/Vector2";
import { ObjectSkin } from "../../../engine/components/ObjectSkin";
import { Sprite } from "../../../engine/data/Sprite";
import { Particle } from "../../../engine/objects/Particle";

export class DelayedParticle extends Particle {
    private remainingTicks: number;

    constructor(
        public readonly delayTicks: number,
        public readonly particle: Particle
    ) {
        const sprite = new Sprite();
        const emptySkin = new ObjectSkin();
        sprite.frames[Particle.defaultFrameName] = [emptySkin];
        
        super(sprite, particle.position, 0, {
            decaySpeed: undefined,
        });
        
        this.remainingTicks = delayTicks;
        this.type = "delayed_particle";
        this.visible = false;
        this.isMovableByWind = false;
    }

    update(ticks: number) {
        super.update(ticks);

        this.remainingTicks -= ticks;
        if (this.remainingTicks > 0) {
            return;
        }

        this.addParticle();
        this.removeFromParent();
    }

    private addParticle(): void {
        const scene = this.scene;
        if (!(scene && scene.particlesObject)) {
            return;
        }

        const particlePos = this.particle.getWorldPosition(new Vector2());

        // Check if particle already exists at this position
        const existingParticle = scene.particlesObject.getParticleAt(particlePos);
        if (existingParticle) {
            scene.particlesObject.remove(existingParticle);
        }

        this.particle.position = this.position.clone();
        scene.particlesObject.add(this.particle);
    }
}

