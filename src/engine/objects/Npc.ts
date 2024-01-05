import { SceneObject } from "./SceneObject";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { distanceTo } from "../../utils/misc";
import { emitEvent } from "../events/EventLoop";
import { GameEvent } from "../events/GameEvent";
import { Scene } from "../Scene";
import { Behavior } from "./Behavior";
import { Equipment } from "./Equipment";
import { Tile } from "./Tile";
import { NpcMovementOptions, defaultMovementOptions } from "./NpcMovementOptions";

export class Npc extends SceneObject {
    private _direction: [number, number] = [0, 1];

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

    get children(): SceneObject[] {
        return [...super.children, this.equipment.objectInMainHand, this.equipment.objectInSecondaryHand, this.mount]
            .filter(x => x) as SceneObject[];
    }

    get direction() {
        return this._direction;
    }

    set direction(value: [number, number]) {
        if (this._direction[0] !== value[0] || this._direction[1] !== value[1]) {
            this._direction = [...value];
            this.onMoved();
        }
    }

    get attackValue(): number {
        return this.basicAttack;  // @todo
    }

    get cursorPosition(): [number, number] {
        return [
            this.position[0] + this.direction[0],
            this.position[1] + this.direction[1]
        ];
    }

    constructor(skin: ObjectSkin = new ObjectSkin(), position: [number, number] = [0, 0], originPoint: [number, number] = [0, 0]) {
        super(originPoint, skin, new ObjectPhysics(`.`, ``), position);
        this.important = true;
    }

    update(ticks: number, scene: Scene) {
        super.update(ticks, scene);
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

        const [nextPosX, nextPosY] = [obj.position[0] + obj.direction[0], obj.position[1] + obj.direction[1]];
        const tile = obj.scene.level.tiles[nextPosY]?.[nextPosX];
        obj.moveSpeedPenalty = this.calculateMoveSpeedPenalty(tile);

        const moveSpeed = this.calculateMoveSpeed(tile);
        const moveSpeedPenalty = obj.moveSpeedPenalty;
        const resultSpeed = Math.round(moveSpeed * moveSpeedPenalty) | 0;
        if (resultSpeed <= 0) {
            return;
        }

        if (obj.moveTick >= 1000 / Math.max(1, resultSpeed)) {
            obj.position = [
                obj.position[0] + obj.direction[0],
                obj.position[1] + obj.direction[1]
            ];

            if (obj.realm === "ground") {
                const tile = this.scene?.getTileAt(obj.position);
                if (tile && tile.snowLevel > 1) {
                    tile.snowLevel -= 1;
                }
            }
            //
            obj.moveTick = 0;
        }
    }

    onMoved() {
        const obj = this;

        // Move equipped items.
        if (obj.equipment.objectInMainHand) {
            obj.equipment.objectInMainHand.position = [...obj.direction];
        }

        if (obj.equipment.objectInSecondaryHand) {
            obj.equipment.objectInSecondaryHand.position = [obj.direction[1], obj.direction[0]];
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

    distanceTo(other: SceneObject): number {
        return distanceTo(this.position, other.position);
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

    static directions: [number, number][] = [[0, 1], [-1, 0], [0, -1], [1, 0]];

    runAway(enemiesNearby: SceneObject[]) {
        const freeDirections = this.getFreeDirections();
        if (freeDirections.length === 0) {
            return;
        }

        const possibleDirs: { direction: [number, number], distance?: number }[] = freeDirections.map(x => ({ direction: x}));
        for (let pd of possibleDirs) {
            const position: [number, number] = [
                this.position[0] + pd.direction[0],
                this.position[1] + pd.direction[1],
            ];
            if (enemiesNearby.length) {
                const distances = enemiesNearby.map(x => distanceTo(position, x.position));
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

    approach(target: SceneObject) {
        const freeDirections = this.getFreeDirections();
        if (freeDirections.length === 0) {
            return;
        }
        
        const possibleDirs: { direction: [number, number], distance?: number }[] = freeDirections.map(x => ({ direction: x }));
        for (let pd of possibleDirs) {
            const position: [number, number] = [
                this.position[0] + pd.direction[0],
                this.position[1] + pd.direction[1],
            ];
            pd.distance = distanceTo(position, target.position);
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
            const randomIndex = Math.random() * Npc.directions.length | 0;
            this.direction = Npc.directions[randomIndex];
        }
    }

    private getFreeDirections() {
        // Detect all possible free positions.
        const directions = Npc.directions
            .map(direction => ({
                direction,
                isBlocked: this.scene!.isPositionBlocked([
                    this.position[0] + direction[0],
                    this.position[1] + direction[1]
                ])}))
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
            this.direction = [...freeDirections[0]];
            this.move();
            return;
        }
        
        // Select random free position.
        const randomIndex = Math.random() * freeDirections.length | 0;
        this.direction = [...freeDirections[randomIndex]];
        this.move();
    }

    moveRandomly(koef: number = 100) {
        if ((Math.random() * koef | 0) === 0) {
            this.moveRandomFreeDirection();
        }
    }

    getMobsNearby(scene: Scene, radius: number, callback: (o: Npc) => boolean): Npc[] {
        const enemies = [];
        for (const object of scene.level.objects) {
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

    getObjectsNearby(scene: Scene, radius: number, callback: (o: SceneObject) => boolean): SceneObject[] {
        const nearObjects = [];
        for (const object of scene.level.objects) {
            if (!object.enabled) continue;
            if (object === this) continue;  // self check
            if (object instanceof SceneObject && callback(object)) {
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
