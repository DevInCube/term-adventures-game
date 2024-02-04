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

export class Npc extends Object2D {
    movementOptions: NpcMovementOptions = defaultMovementOptions.walking;
    moveTick: number = 0;
    equipment: Equipment = new Equipment(this);
    health: number = 1;
    maxHealth: number = 3;
    basicAttack: number = 1;
    attackTick: number = 0;
    attackSpeed: number = 1; // atk per second
    behaviors: Behavior[] = [];
    mount: Npc | null = null;

    get globalDirection(): Vector2 {
        return Vector2.right.rotate(this.globalRotation);
    }

    get attackValue(): number {
        return this.basicAttack;  // @todo
    }

    get globalCursorPosition(): Vector2 {
        return this.globalPosition.clone().add(this.globalDirection);
    }

    constructor(
        skin: ObjectSkin = new ObjectSkin(), 
        position: Vector2 = Vector2.zero, 
        originPoint: Vector2 = Vector2.zero
    ) {
        super(originPoint, skin, new ObjectPhysics().collision(), position);
        this.important = true;
    }

    update(ticks: number) {
        super.update(ticks);
        this.moveTick += ticks;
        this.attackTick += ticks;
        //
        
        for (const b of this.behaviors) {
            b.update(ticks, this);
        }
    }

    move(): void {
        const tile = this.scene!.tilesObject.getTileAt(this.globalCursorPosition)!;
        const moveSpeed = this.calculateMoveSpeed(tile);
        const moveSpeedPenalty = this.calculateMoveSpeedPenalty(tile);
        const resultSpeed = Math.round(moveSpeed * moveSpeedPenalty) | 0;
        if (resultSpeed <= 0) {
            return;
        }

        if (this.moveTick >= 1000 / Math.max(1, resultSpeed)) {
            this.doMove();
            this.moveTick = 0;
        }
    }

    private doMove() {
        const tile = this.scene?.tilesObject.getTileAt(this.globalPosition);
        if (this.realm === "ground") {
            tile?.addDisturbance();
        }

        this.position.add(this.globalDirection);

        if (this.realm === "ground") {
            tile?.decreaseSnow();
        }
    }

    attack(target: Npc): void {
        if (this.attackTick > 1000 / this.attackSpeed) {
            this.attackTick = 0;
            emitEvent(new GameEvent(this, "attack", {
                object: this,
                subject: target,
            }));
        }
    }

    distanceTo(other: Object2D): number {
        return this.globalPosition.distanceTo(other.globalPosition);
    }

    handleEvent(ev: GameEvent) {
        super.handleEvent(ev);
        if (ev.type === "attack" && ev.args.subject === this) {
            const damage = ev.args.object.attackValue;
            this.health -= damage;
            emitEvent(new GameEvent(ev.args.object, "damage", Object.create(ev.args)));
            if (this.health <= 0) {
                this.enabled = false;
                emitEvent(new GameEvent(this, "death", { object: this, cause: { type: "attacked", by: ev.args.object }}));
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
            const position = this.globalPosition.clone().add(pd.direction);
            if (enemiesNearby.length) {
                const distances = enemiesNearby.map(x => position.distanceTo(x.globalPosition));
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
        const freeDirections = this.getFreeDirections();
        if (freeDirections.length === 0) {
            return;
        }
        
        const possibleDirs: { direction: Vector2, distance?: number }[] = freeDirections.map(x => ({ direction: x }));
        for (let pd of possibleDirs) {
            const position = this.globalPosition.clone().add(pd.direction);
            pd.distance = position.distanceTo(target.globalPosition);
        }

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
                return ({
                    direction,
                    isBlocked: this.scene!.isPositionBlocked(this.globalPosition.clone().add(direction))
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
            if (object instanceof Npc && callback(object)) {
                if (this.distanceTo(object) < radius) {
                    enemies.push(object);
                }
            }
        }
        return enemies;
    }

    getObjectsNearby(scene: Level, radius: number, callback: (o: Object2D) => boolean): Object2D[] {
        const nearObjects = [];
        for (const object of scene.children) {
            if (!object.enabled) continue;
            if (object === this) continue;  // self check
            if (object instanceof Object2D && callback(object)) {
                if (this.distanceTo(object) < radius) {
                    nearObjects.push(object);
                }
            }
        }
        return nearObjects;
    }

    private calculateMoveSpeedPenalty(tile: Tile | null): number {
        if (!tile) {
            return 0;
        }

        return tile.totalMovementPenalty;
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
