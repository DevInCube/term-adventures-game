import { GameEvent } from "../events/GameEvent";
import { GameEventHandler } from "../events/GameEventHandler";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Npc } from "./Npc";
import { Inventory } from "./Inventory";
import { Level } from "../Level";
import { Vector2 } from "../math/Vector2";
import { Layer } from "../graphics/Layers";
import { Camera } from "../cameras/Camera";
import { Scene } from "../Scene";
import { CanvasRenderer } from "../renderers/CanvasRenderer";

export type GameObjectActionContext = {
    obj: Object2D
    initiator: Npc,
    subject: Object2D | undefined,
};
export type GameObjectAction = (ctx: GameObjectActionContext) => void;
export type GameObjectEventHandler = (obj: Object2D, ev: GameEvent) => void;

export type ObjectActionType = "interaction" | "collision" | "usage";

export type ObjectAction = {
    type: ObjectActionType;
    position: Vector2;
    callback: GameObjectAction;
    iconPosition: Vector2;
}

type SetActionOptions = {
    type?: ObjectActionType,
    position?: Vector2,
    action: GameObjectAction,
    iconPosition?: Vector2,
};

// Buffers.
const _position = new Vector2();

export class Object2D implements GameEventHandler {
    isObject2D = true;
    static isObject2D(x: any): x is Object2D { return x.isObject2D === true; }

    public parent: Object2D | null = null;
    public children: Object2D[] = [];
    public name: string = "";
    public type: string = "<undefined_item>";
    public enabled = true;
    public visible = true;
    public layer: Layer = "objects";
    public renderOrder: number = 0;
    private _rotation: number = 0;
    private _worldRotation: number = 0;
    private _worldPosition: Vector2 = Vector2.zero;
    public highlighted = false;
    public highlighColor: string = '#0ff';
    public parameters: {[key: string]: any} = {};
    public actions: ObjectAction[] = [];
    public inventory: Inventory = new Inventory();
    public realm: "ground" | "water" | "sky" | "soul" = "ground";
    protected ticks: number = 0;

    public get scene(): Level | undefined {
        let level: Level | undefined = undefined;
        this.traverseAncestors(x => {
            if (x && "isLevel" in x) {
                level = x as Level;
            }
        });
        return level;
    }

    get globalRotation(): number {
        this.updateWorldMatrix(true, false);
        return this._worldRotation;
    }

    constructor(
        public originPoint: Vector2 = new Vector2(),
        public skin: ObjectSkin = new ObjectSkin(),
        public physics: ObjectPhysics = new ObjectPhysics(),
        public position: Vector2 = new Vector2(),
    ) {
    }

    public getWorldPosition(target: Vector2): Vector2 {
        this.updateWorldMatrix(true, false);
        return target.copy(this._worldPosition);
    }

    
    public getWorldDirection(target: Vector2): Vector2 {
        return target.copy(Vector2.right).rotate(this.globalRotation);
    }

    public updateMatrixWorld() {
        this.updateThisWorld();

        for (const child of this.children) {
            child.updateMatrixWorld();
        }
    }

    public updateWorldMatrix(updateParents: boolean, updateChildren: boolean) {
        if (updateParents && this.parent) {
            this.parent.updateWorldMatrix(true, false);
        }

        this.updateThisWorld();

        if (updateChildren) {
            for (const child of this.children) {
                child.updateWorldMatrix(false, true);
            }
        }
    }

    private updateThisWorld() {
        if (!this.parent) {
            this._worldPosition.copy(this.position);
            this._worldRotation = this._rotation;
        } else {
            this._worldPosition.copy(this.parent._worldPosition).add(_position.copy(this.position).rotate(this.parent._worldRotation));
            this._worldRotation = this.parent._worldRotation + this._rotation;
        }
    }

    public translateX(x: number) {
        this.position.x += x;
        return this;
    }
    
    public translateY(y: number) {
        this.position.y += y;
        return this;
    }
    
    public rotate(rotation: number = 1) {
        this._rotation = this._rotation + rotation;
        return this;
    }

    public lookAt(position: Vector2) {
        const degrees = position.angle;
        this._rotation = (degrees / 360) * 4 | 0;
        this.updateMatrixWorld();
    }
 
    public add(object: Object2D) {
        if (object === this) {
            throw new Error("Can not add an object to itself.");
        }

        if (object.parent !== null) {
            object.parent.remove(object);
        }

        object.parent = this;
        this.children.push(object);
        return this;
    }

    public remove(object: Object2D) {
        const index = this.children.indexOf(object);
        if (index !== -1) {
            object.parent = null;
            this.children.splice(index, 1);
        }
    }
    
    public removeFromParent() {
        const parent = this.parent;
        if (parent !== null) {
            parent.remove(this);
        }
    }

    setAction(arg: SetActionOptions | GameObjectAction) {
        if (typeof arg === "function") {
            this.setAction(<SetActionOptions>{ action: arg as GameObjectAction});
            return;
        }

        const options = arg as SetActionOptions;
        if (options) {
            const type = options.type || "interaction";

            // There can be only one usage action.
            if (type === "usage" && this.actions.find(x => x.type === "usage")) {
                throw new Error(`Object '${this.type}' already has registered '${type}' action.`);
            }

            const position = options.position || Vector2.zero;
            const iconPosition = options.iconPosition || position;
            this.actions.push({
                type,
                position,
                callback: options.action,
                iconPosition,
            });
        }
    }

    handleEvent(ev: GameEvent) {
    }

    onBeforeRender(renderer: CanvasRenderer, scene: Scene, camera: Camera) {
    }

    update(ticks: number) { 
        this.ticks += ticks;
        for (const object of this.children) {
            if (!object.enabled) {
                continue;
            }
            
            object.update(ticks);
        }
    }

    public traverse(callback: (object: Object2D) => void) {
		if (this.enabled === false) {
            return;
        }

		callback(this);

		const children = this.children;
		for (let i = 0, length = children.length; i < length; i++) {
			children[i].traverse(callback);
		}
	}

    public traverseVisible(callback: (object: Object2D) => void) {
		if (this.enabled === false || this.visible === false) {
            return;
        }

		callback(this);

		const children = this.children;
		for (let i = 0, length = children.length; i < length; i++) {
			children[i].traverseVisible(callback);
		}
	}

    public traverseAncestors(callback: (object: Object2D) => void) {
        const parent = this.parent;
        if (!parent) {
            return;
        }
        
        callback(parent);
        parent.traverseAncestors(callback);
    }

    public static updateValue(oldValue: number, increment: number, maxValue: number, action?: () => void): number {
        const newValue = oldValue + increment;
        const overflow = newValue - maxValue;
        if (overflow < 0) {
            return newValue;
        }

        action?.();
        return overflow;
    }
}
