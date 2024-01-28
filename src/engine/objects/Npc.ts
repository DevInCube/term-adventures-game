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
import { Faces } from "../math/Face";
import { Level } from "../Level";

export class Npc extends Object2D {
    private _direction: Vector2 = new Vector2(0, 1);

    showCursor: boolean = false;
    movementOptions: NpcMovementOptions = defaultMovementOptions.walking;
    moveSpeedPenalty: number = 0;
    moveTick: number = 0;
    equipment: Equipment = new Equipment(this);
    health: number = 1;
    maxHealth: number = 3;
    basicAttack: number = 1;
    attackTick: number = 0;
    attackSpeed: number = 1; // atk per second
    behaviors: Behavior[] = [];
    mount: Npc | null = null;

    /*get children(): Object2D[] {
        return [...super.children, ...this.equipment.objects, this.mount]
            .filter(x => x) as Object2D[];
    }*/

    get direction(): Vector2 {
        return this._direction;
    }

    set direction(value: Vector2) {
        if (!this._direction.equals(value)) {
            this._direction = value.clone();
            this.moveEquippedItems();
        }
    }

    get attackValue(): number {
        return this.basicAttack;  // @todo
    }

    get cursorPosition(): Vector2 {
        return this.position.clone().add(this.direction);
    }

    constructor(skin: ObjectSkin = new ObjectSkin(), position: Vector2 = Vector2.zero, originPoint: Vector2 = Vector2.zero) {
        super(originPoint, skin, new ObjectPhysics(`.`, ``), position);
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
        const obj = this;
        if (!obj.scene) {
            console.error("Can not move. Object is not bound to scene.");
            return;
        }

        const nextPos = obj.cursorPosition;
        const tile = obj.scene.tiles[nextPos.y]?.[nextPos.x];
        obj.moveSpeedPenalty = this.calculateMoveSpeedPenalty(tile);

        const moveSpeed = this.calculateMoveSpeed(tile);
        const moveSpeedPenalty = obj.moveSpeedPenalty;
        const resultSpeed = Math.round(moveSpeed * moveSpeedPenalty) | 0;
        if (resultSpeed <= 0) {
            return;
        }

        if (obj.moveTick >= 1000 / Math.max(1, resultSpeed)) {
            if (obj.realm === "ground") {
                const tile = this.scene?.getTileAt(obj.position);
                tile?.addDisturbance();
            }

            // Assign to trigger property.
            obj.position = obj.position.add(obj.direction);

            if (obj.realm === "ground") {
                const tile = this.scene?.getTileAt(obj.position);
                tile?.decreaseSnow();
            }
            //
            obj.moveTick = 0;
        }
    }

    private moveEquippedItems() {
        const obj = this;

        if (obj.equipment.objectInMainHand) {
            obj.equipment.objectInMainHand.position = obj.direction.clone();
        }

        if (obj.equipment.objectInSecondaryHand) {
            obj.equipment.objectInSecondaryHand.position = new Vector2(obj.direction.y, obj.direction.x);  // TODO: rotate vector.
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
        return this.position.distanceTo(other.position);
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
            const position = this.position.clone().add(pd.direction);
            if (enemiesNearby.length) {
                const distances = enemiesNearby.map(x => position.distanceTo(x.position));
                const nearestEnemyDistance = Math.min(...distances);
                pd.distance = nearestEnemyDistance;
            }
        }

        const direction = possibleDirs;
        direction.sort((x, y) => <number>y.distance - <number>x.distance);
        if (direction.length) {
            if (direction.length > 1 && direction[0].distance === direction[1].distance) {
                const randIndex = Math.random() * 2 | 0;
                this.direction = direction[randIndex].direction;
            } else {
                this.direction = direction[0].direction;
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
            const position = this.position.clone().add(pd.direction);
            pd.distance = position.distanceTo(target.position);
        }

        const direction = possibleDirs;
        direction.sort((x, y) => <number>x.distance - <number>y.distance);
        if (direction.length) {
            if (direction.length > 1 && direction[0].distance === direction[1].distance) {
                const randIndex = Math.random() * 2 | 0;
                this.direction = direction[randIndex].direction;
            } else {
                this.direction = direction[0].direction;
            }

            this.move();
        }
    }

    faceRandomDirection(koef: number = 100) {
        if ((Math.random() * koef | 0) === 0) {
            const randomIndex = Math.random() * Faces.length | 0;
            this.direction = Vector2.fromFace(Faces[randomIndex]);
        }
    }

    private getFreeDirections(): Vector2[] {
        // Detect all possible free positions.
        const directions = Faces
            .map(x => Vector2.fromFace(x))
            .map(direction => {
                return ({
                    direction,
                    isBlocked: this.scene!.isPositionBlocked(this.position.clone().add(direction))
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
            this.direction = freeDirections[0].clone();
            this.move();
            return;
        }
        
        // Select random free position.
        const randomIndex = Math.random() * freeDirections.length | 0;
        this.direction = freeDirections[randomIndex].clone();
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
