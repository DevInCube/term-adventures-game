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
import { MountBehavior } from "../../world/behaviors/MountBehavior";

export class Npc extends SceneObject {
    private _direction: [number, number] = [0, 1];

    showCursor: boolean = false;
    moveSpeed: number = 2; // cells per second
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
    mounter: Npc | null = null;

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

        const nextPos = [obj.position[0] + obj.direction[0], obj.position[1] + obj.direction[1]];
        if (!this.scene) {
            console.error("Can not move. Object is not bound to scene.");
            return;
        }

        const tile = this.scene.level.tiles[nextPos[1]] && this.scene.level.tiles[nextPos[1]][nextPos[0]];
        obj.moveSpeedPenalty = this.calculateMoveSpeedPenalty(tile);

        const moveSpeed = obj.moveSpeed;
        const moveSpeedPenalty = obj.moveSpeedPenalty;
        const resultSpeed = moveSpeed - moveSpeedPenalty;
        if (resultSpeed <= 0) {
            return;
        }

        if (obj.moveTick >= 1000 / Math.max(1, resultSpeed)) {
            obj.position = [
                obj.position[0] + obj.direction[0],
                obj.position[1] + obj.direction[1]
            ];
            //
            obj.moveTick = 0;
        }
    }

    onMoved() {
        const obj = this;

        // Move equipped items.
        if (obj.equipment.objectInMainHand) {
            obj.equipment.objectInMainHand.position = [...obj.cursorPosition];
        }

        if (obj.equipment.objectInSecondaryHand) {
            obj.equipment.objectInSecondaryHand.position = [
                obj.position[0] + obj.direction[1],
                obj.position[1] - obj.direction[0],
            ];
        }
        
        // TODO: this should be in a behavior somehow.
        if (this.mounter) {
            MountBehavior.moveMounter(this.mounter);
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

    runAway(scene: Scene, enemiesNearby: SceneObject[]) {
        const possibleDirs: { direction: [number, number], available?: boolean, distance?: number }[] = [
            { direction: [-1, 0] },
            { direction: [+1, 0] },
            { direction: [0, -1] },
            { direction: [0, +1] },
        ];
        for (let pd of possibleDirs) {
            const position: [number, number] = [
                this.position[0] + pd.direction[0],
                this.position[1] + pd.direction[1],
            ];
            pd.available = !scene.isPositionBlocked(position);
            if (enemiesNearby.length) {
                pd.distance = distanceTo(position, enemiesNearby[0].position);
            }
        }
        const direction = possibleDirs.filter(x => x.available);
        direction.sort((x, y) => <number>y.distance - <number>x.distance);
        if (direction.length) {
            this.direction = direction[0].direction;
            this.move();
        }
    }

    approach(scene: Scene, target: SceneObject) {
        const possibleDirs: { direction: [number, number], available?: boolean, distance?: number }[] = [
            { direction: [-1, 0] },
            { direction: [+1, 0] },
            { direction: [0, -1] },
            { direction: [0, +1] },
        ];
        for (let pd of possibleDirs) {
            const position: [number, number] = [
                this.position[0] + pd.direction[0],
                this.position[1] + pd.direction[1],
            ];
            pd.available = !scene.isPositionBlocked(position);
            pd.distance = distanceTo(position, target.position);
        }
        const direction = possibleDirs.filter(x => x.available);
        direction.sort((x, y) => <number>x.distance - <number>y.distance);
        if (direction.length) {
            this.direction = direction[0].direction;
            this.move();
        }
    }

    directions: [number, number][] = [[0, 1], [-1, 0], [0, -1], [1, 0]];

    faceRandomDirection(koef: number = 100) {
        if ((Math.random() * koef | 0) === 0) {
            const randomIndex = Math.random() * this.directions.length | 0;
            this.direction = this.directions[randomIndex];
        }
    }

    moveRandomFreeDirection() {
        // Detect all possible free positions.
        const freeDirections = this.directions
            .map(direction => ({
                direction,
                isBlocked: this.scene!.isPositionBlocked([
                    this.position[0] + direction[0],
                    this.position[1] + direction[1]
                ])}))
            .filter(x => !x.isBlocked)
            .map(x => x.direction);

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
        const obj = this.mount || this;
        if (!tile) {
            return obj.moveSpeed;
        }

        const canFly = obj.type === "dragon";
        if (canFly && obj.realm === "sky") {
            return -15;
        }

        if (obj.realm === "sky" || obj.realm === "soul") {
            return 0;
        }

        const isWater = tile.type === 'water' || tile.type === 'water_deep';
        const isMountain = tile.type === 'mountain';

        // TODO: npc type: walking, water, flying. etc.
        const canSwim = obj.type === "human" || obj.type === "deer";
        const canClimbMountain = obj.type === "snail";
        const isWaterCreature = obj.type === "turtle" || obj.type === "fish";

        if (isWaterCreature && isWater) {
            return -10;
        } 

        if (canClimbMountain && isMountain) {
            return 0;
        }

        if (isWater) {
            if (canSwim) {
                return obj.moveSpeed - 1;
            }

            return obj.moveSpeed;
        } else if (isMountain) {
            return obj.moveSpeed;
        } else {
            return 0;
        }
    }
}
