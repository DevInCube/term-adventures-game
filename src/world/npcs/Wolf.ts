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
import { DeathGameEvent } from "../events/DeathGameEvent";

export class Wolf extends Npc {
    hunter;
    fear;
    wanderer;
    state: "wandering" | "hunting" | "feared" | "still" = "still";

    constructor() {
        super(new ObjectSkin().char(`🐺`));

        this.type = "wolf";
        this.maxHealth = 10;
        this.health = 5;
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
        this.behaviors.push(...[this.hunter, this.fear, this.wanderer]);
    }


    update(ticks: number) {
        super.update(ticks);
        //
        if (this.fear.enemies.length > 0) {
            this.fear.act(ticks, this);
            this.state = "feared";
        } else if (this.hunter.target) {
            this.hunter.act(ticks, this);
            this.state = "hunting";
        } else if (this.hunter.hunger > 3) {
            this.wanderer.act(ticks, this);
            this.state = "wandering";
        } else {
            this.state = "still";
        }
    }

    onBeforeRender(renderer: CanvasRenderer, scene: Scene, camera: Camera): void {
        super.onBeforeRender(renderer, scene, camera);
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
        super.handleEvent(ev);
        if (ev.type === DeathGameEvent.type) {
            const args = <DeathGameEvent.Args>ev.args;
            if (args.object === this.hunter.target) {
                this.hunter.target = undefined;
                if (args.by === this) {
                    // TODO: use loot for this.
                    this.hunter.hunger = 0;
                }
            }
        }
    }
};

export function wolf(options: { position: [number, number] }) {
    const position = Vector2.from(options.position)
    return new Wolf().translateX(position.x).translateY(position.y);
}
