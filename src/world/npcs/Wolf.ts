import { Npc } from "../../engine/objects/Npc";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { HunterBehavior } from "../behaviors/HunterBehavior";
import { NpcMovementOptions, defaultMovementOptions } from "../../engine/objects/NpcMovementOptions";
import { Vector2 } from "../../engine/math/Vector2";
import { FearBehavior } from "../behaviors/FearBehavior";
import { WanderingBehavior } from "../behaviors/WanderingBehavior";
import { Scene } from "../../engine/Scene";
import { Camera } from "../../engine/cameras/Camera";
import { CanvasRenderer } from "../../engine/renderers/CanvasRenderer";
import { GameEvent } from "../../engine/events/GameEvent";

export class Wolf extends Npc {
    hunter;
    fear;
    wanderer;
    state: "wandering" | "hunting" | "feared" | "still" = "still";

    constructor() {
        super(new ObjectSkin().char(`🐺`));

        this.type = "wolf";
        this.movementOptions = <NpcMovementOptions>{
            ...defaultMovementOptions.walking,
            walkingSpeed: 5,
        };

        this.hunter = new HunterBehavior({
            preyTypes: ['sheep', 'human'],
        });
        this.fear = new FearBehavior({
            enemyTypes: ['campfire'],
        })
        this.wanderer = new WanderingBehavior();
        this.behaviors.push(...[this.hunter, this.fear]);
    }


    update(ticks: number) {
        super.update(ticks);
        //
        const object = this;
        if (this.fear.enemies.length > 0) {
            object.runAway(this.fear.enemies);
            this.state = "feared";
        } else if (this.hunter.target) {
            if (object.distanceTo(this.hunter.target) <= 1.0) {
                object.attack(this.hunter.target);
            }
            
            object.approach(this.hunter.target);
            this.state = "hunting";
        } else if (this.hunter.hunger > 3) {
            this.wanderer.update(ticks, object);
            this.state = "wandering";
        } else {
            this.state = "still";
        }
    }

    onBeforeRender(renderer: CanvasRenderer, scene: Scene, camera: Camera): void {
        if (this.state === "feared") {
            this.skin.background('#FF000055');
        } else if (this.state === "hunting") {
            this.skin.background('violet');
        } else if (this.state === "wandering") {
            this.skin.background('yellow');
        } else {
            this.skin.background('transparent');
        }
    }

    handleEvent(ev: GameEvent): void {
        if (ev.type === "death" && ev.args.object === this.hunter.target) {
            this.hunter.target = undefined;
            if (ev.args.cause.type === "attacked" && ev.args.cause.by === this) {
                this.hunter.hunger = 0;
            }
        }
    }
};

export function wolf(options: { position: [number, number] }) {
    const position = Vector2.from(options.position)
    return new Wolf().translateX(position.x).translateY(position.y);
}
