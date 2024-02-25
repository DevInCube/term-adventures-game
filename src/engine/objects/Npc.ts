import { Object2D } from "./Object2D";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { emitEvent } from "../events/EventLoop";
import { GameEvent } from "../events/GameEvent";
import { Behavior } from "./Behavior";
import { Equipment } from "./Equipment";
import { Tile } from "./Tile";
import { NpcMovementOptions, defaultMovementOptions } from "./NpcMovementOptions";
import { Vector2 } from "../math/Vector2";
import { Level } from "../Level";
import { clamp } from "../../utils/math";
import { isDamageReduction } from "../effects/DamageEffect";
import { isSlowness, isSlownessReduction } from "../effects/SlownessEffect";
import { ActiveEffect } from "../effects/ActiveEffect";
import { Effect } from "../effects/Effect";
import { DamageGameEvent } from "../../world/events/DamageGameEvent";
import { DeathGameEvent } from "../../world/events/DeathGameEvent";

const _position = new Vector2();
const _position2 = new Vector2();
const _direction = new Vector2();

export class Npc extends Object2D {
    movementOptions: NpcMovementOptions = defaultMovementOptions.walking;
    moveTick: number = 0;
    equipment: Equipment = new Equipment(this);
    health: number = 1;
    maxHealth: number = 3;
    basicAttack: number = 1;
    attackTick: number = 0;
    attackSpeed: number = 1; // atk per second
    movementPenalty: number = 1;
    behaviors: Behavior[] = [];
    mount: Npc | null = null;
    target: Npc | undefined = undefined;
    public isUnobstructed = true;
    public effects: ActiveEffect[] = [];
    private _isMoveRequested = false; 

    get attackValue(): number {
        return this.basicAttack;  // @todo
    }

    get attackDamageType(): string {
        // TODO: use this.equipment.objectInMainHand damage type.
        return "physical";
    }

    constructor(
        skin: ObjectSkin = new ObjectSkin(), 
        position: Vector2 = Vector2.zero, 
        originPoint: Vector2 = Vector2.zero
    ) {
        super(originPoint, skin, new ObjectPhysics().collision(), position);
    }
    
    public getWorldCursorPosition(target: Vector2): Vector2 {
        return this.getWorldPosition(target).add(this.getWorldDirection(_position2));
    }

    update(ticks: number) {
        super.update(ticks);
        this.moveTick += ticks;
        this.attackTick += ticks;

        // reset values
        this.movementPenalty = 1;
        //
        const tile = this.scene!.tilesObject.getTileAt(this.getWorldPosition(_position))!;
        const tileEffects = tile.effects;
        for (const newEffect of tileEffects) {
            this.tryAddEffect(newEffect, tile);
        }
        //
        for (const b of this.behaviors) {
            b.update(ticks, this);
        }

        if (this._isMoveRequested) {
            this.calculateMove();
            this._isMoveRequested = false;
        }
        //
        for (const effect of this.effects) {
            effect.update(ticks, this);
        }

        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            if (effect.isExpired()) {
                //console.log(`Removed active effect '${effect.effect.name}.${effect.effect.type}'.`);
                this.effects.splice(i, 1);
            }
        }
    }

    tryAddEffect(newEffect: Effect, damager: Object2D) {
        if (newEffect.isStackable) {
            this.effects.push(newEffect.activate(damager));
            return;
        }
        
        const existingIndex = this.effects
            .map(x => x.effect)
            .findIndex(x => x.name === newEffect.name && x.type === newEffect.type);
        if (existingIndex === -1) {
            this.effects.push(newEffect.activate(damager));
            return;
        }

        if (newEffect.isMaxOverridable && 
            newEffect.value > this.effects[existingIndex].effect.value
        ) {
            this.effects.splice(existingIndex, 1);
            this.effects.push(newEffect.activate(damager));
            return;
        }
    }

    move(): void {
        this._isMoveRequested = true;
    }

    private calculateMove() {
        const position = this.getWorldCursorPosition(_position);
        const tile = this.scene!.tilesObject.getTileAt(position)!;
        const moveSpeed = this.calculateMoveSpeed(tile);
        const moveSpeedPenalty = this.getTotalMovementPenalty();
        console.log(`Slowness is ${moveSpeedPenalty}.`);
        const resultSpeed = Math.round(moveSpeed * (1 - moveSpeedPenalty)) | 0;
        if (resultSpeed <= 0) {
            return;
        }
        
        if (this.moveTick >= 1000 / Math.max(1, resultSpeed)) {
            this.doMove();
            this.moveTick = 0;
        }
    }

    private doMove() {
        const position = this.getWorldPosition(_position);
        const tile = this.scene?.tilesObject.getTileAt(position);
        if (this.realm === "ground") {
            tile?.addHardDisturbance();
        }

        this.position.add(this.getWorldDirection(_direction));
        this.updateMatrixWorld();

        if (this.realm === "ground") {
            tile?.decreaseSnow();
        }
    }

    attack(target: Object2D): void {
        const overflow = this.attackTick - 1000 / this.attackSpeed;
        if (overflow >= 0) {
            this.attackTick = 0;
            emitEvent(DamageGameEvent.create(this, target, this.attackValue, this.attackDamageType));
        }
    }

    distanceTo(other: Object2D): number {
        const thisPosition = this.getWorldPosition(_position);
        const otherPosition = other.getWorldPosition(_position2);
        return thisPosition.distanceTo(otherPosition);
    }

    damage(value: number, type: string, damager: Object2D) {
        const resultDamage = this.calculateResultDamage(value, type);
        console.log(`${this.type} got ${resultDamage} ${type} damage from ${damager.type}.`);
        this.health = Math.max(0, this.health - resultDamage);
        // TODO: add damage visual effects.
        if (this.health === 0) {
            this.enabled = false;
            emitEvent(DeathGameEvent.create(this, type, damager));
        }
    }

    getTotalMovementPenalty(): number {
        const effects = [...this.effects.map(x => x.effect), ...this.equipment.getEffects()]
            .filter(isSlowness);
        const slownessValues = effects
            .map(x => ({
                type: x.type,
                slowness: x.movementPenalty * (1 - this.getTotalSlownessReduction(x.type)),
            }));
        const sum = slownessValues.reduce((a, x) => a += x.slowness, 0);
        const result = clamp(sum, 0, 1);
        return result;
    }

    getTotalSlownessReduction(type: string): number {
        const effects = this.equipment.getEffects()
            .filter(isSlownessReduction)
            .filter(x => x.type === type);
        const sum = effects.reduce((a, x) => a += x.reduction, 0);
        const result = clamp(sum, 0, 1);
        return result;
    }

    getTotalDamageReduction(type: string): number {
        const effects = this.equipment.getEffects()
            .filter(isDamageReduction)
            .filter(x => x.type === type);
        const sum = effects.reduce((a, x) => a += x.reduction, 0);
        const result = clamp(sum, 0, 1);
        return result;
    }

    calculateResultDamage(value: number, type: string) {
        const reduction = this.getTotalDamageReduction(type);
        return value * (1 - reduction);
    }

    handleEvent(ev: GameEvent) {
        super.handleEvent(ev);
        if (ev.type === DamageGameEvent.type) {
            const args = <DamageGameEvent.Args>ev.args;
            if (args.subject === this) {
                this.damage(args.damageValue, args.damageType, args.object);
            }
        }

        for (const b of this.behaviors) {
            b.handleEvent(ev, this);
        }
    }

    runAway(enemiesNearby: Object2D[]) {
        const freeDirections = this.getFreeDirections();
        if (freeDirections.length === 0) {
            return;
        }

        const possibleDirs: { direction: Vector2, distance?: number }[] = freeDirections.map(x => ({ direction: x}));
        for (let pd of possibleDirs) {
            const position = this.getWorldPosition(_position).add(pd.direction);
            if (enemiesNearby.length) {
                const distances = enemiesNearby.map(x => position.distanceTo(x.getWorldPosition(_position2)));
                const nearestEnemyDistance = Math.min(...distances);
                pd.distance = nearestEnemyDistance;
            }
        }

        const direction = possibleDirs;
        direction.sort((x, y) => <number>y.distance - <number>x.distance);
        if (direction.length) {
            if (direction.length > 1 && direction[0].distance === direction[1].distance) {
                const randIndex = Math.random() * 2 | 0;
                this.lookAt(direction[randIndex].direction);
            } else {
                this.lookAt(direction[0].direction);
            }

            this.move();
        }
    }

    approach(target: Object2D) {
        const npcPosition = this.getWorldPosition(_position)
        const targetPosition = target.getWorldPosition(_position2);
        if (npcPosition.distanceTo(targetPosition) <= 1.0) {
            return;
        }

        const freeDirections = this.getFreeDirections();
        if (freeDirections.length === 0) {
            return;
        }
        
        const possibleDirs = freeDirections
            .map(x => {
                const position = this.getWorldPosition(_position).add(x);
                return {
                    direction: x,
                    distance: position.distanceTo(targetPosition),
                };
            });

        const direction = possibleDirs;
        direction.sort((x, y) => <number>x.distance - <number>y.distance);
        if (direction.length) {
            if (direction.length > 1 && direction[0].distance === direction[1].distance) {
                const randIndex = Math.random() * 2 | 0;
                this.lookAt(direction[randIndex].direction);
            } else {
                this.lookAt(direction[0].direction);
            }

            this.move();
        }
    }

    faceRandomDirection(koef: number = 100) {
        if ((Math.random() * koef | 0) === 0) {
            const directions = Vector2.directions;
            const randomIndex = Math.random() * directions.length | 0;
            this.lookAt(directions[randomIndex]);
        }
    }

    private getFreeDirections(): Vector2[] {
        // Detect all possible free positions.
        const directions = Vector2.directions
            .map(direction => {
                const position = this.getWorldPosition(_position).add(direction)
                return ({
                    direction,
                    isBlocked: this.scene!.isPositionBlocked(position)
                });
            })
            .filter(x => !x.isBlocked)
            .map(x => x.direction);
        return directions;
    }

    moveRandomFreeDirection() {
        const freeDirections = this.getFreeDirections();
        if (freeDirections.length === 0) {
            return;
        }

        if (freeDirections.length === 1) {
            this.lookAt(freeDirections[0]);
            this.move();
            return;
        }
        
        // Select random free position.
        const randomIndex = Math.random() * freeDirections.length | 0;
        this.lookAt(freeDirections[randomIndex]);
        this.move();
    }

    moveRandomly(koef: number = 100) {
        if ((Math.random() * koef | 0) === 0) {
            this.moveRandomFreeDirection();
        }
    }

    getMobsNearby(scene: Level, radius: number, callback: (o: Npc) => boolean): Npc[] {
        const enemies = [];
        for (const object of scene.children) {
            if (!object.enabled) continue;
            if (object === this) continue;  // self check
            if (object instanceof Npc && 
                callback(object) &&
                this.distanceTo(object) < radius
            ) {
                enemies.push(object);
            }
        }
        return enemies;
    }

    getObjectsNearby(scene: Level, radius: number, callback: (o: Object2D) => boolean): Object2D[] {
        const nearObjects = [];
        for (const object of scene.children) {
            if (!object.enabled) continue;
            if (object === this) continue;  // self check
            if (callback(object) &&
                this.distanceTo(object) < radius
            ) {
                nearObjects.push(object);
            }
        }
        return nearObjects;
    }

    private calculateMoveSpeed(tile: Tile | null): number {
        if (!tile) {
            return 0;
        }

        const obj = this.mount || this;

        const isFlying = obj.realm === "sky" || obj.realm === "soul";
        const isInWater = tile.category === "liquid";
        const isOnMountain = tile.category === "elevated";

        if (isFlying) {
            return obj.movementOptions.flyingSpeed;
        } else if (isInWater) {
            return obj.movementOptions.swimmingSpeed;
        } else if (isOnMountain) {
            return obj.movementOptions.climbingSpeed;
        } else {
            return obj.movementOptions.walkingSpeed;
        }
    }
}
