import { GameEvent, GameEventHandler } from "../events/GameEvent";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Scene } from "../Scene";
import { Npc } from "./Npc";
import { Inventory } from "./Inventory";
import { Level } from "../Level";
import { Vector2 } from "../math/Vector2";

export type GameObjectActionContext = {
    obj: Object2D
    initiator: Npc,
    subject: Object2D | undefined,
};
export type GameObjectAction = (ctx: GameObjectActionContext) => void;
export type UpdateHandler = (ticks: number, obj: Object2D, scene: Scene) => void;
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

export class Object2D implements GameEventHandler {
    public scene: Scene | null = null;
    public parent: Object2D | null = null;
    public children: Object2D[] = [];
    public name: string = "";
    public type: string = "<undefined_item>";
    public enabled = true;
    public highlighted = false;
    public highlighColor: string = '#0ff';
    public important = false;
    public parameters: {[key: string]: any} = {};
    public actions: ObjectAction[] = [];
    public inventory: Inventory = new Inventory();
    public realm: "ground" | "water" | "sky" | "soul" = "ground";
    ticks: number = 0;

    get position(): Vector2 {
        return (this.parent?.position?.clone() || Vector2.zero).add(this._position);
    }

    set position(value: Vector2) {
        if (!this.position.equals(value)) {
            this._position = value.clone();
        }
    }


    constructor(
        public originPoint: Vector2 = new Vector2(),
        public skin: ObjectSkin = new ObjectSkin(),
        public physics: ObjectPhysics = new ObjectPhysics(),
        private _position: Vector2 = new Vector2()) {
        
        //
    }

    public add(object: Object2D) {
        if (object === this) {
            throw new Error("Can not add an object to itself.");
        }

        if (object.parent != null) {
            object.parent.remove(object);
        }

        object.parent = this;
        this.children.push(object);
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

    handleEvent(ev: GameEvent) { }

    update(ticks: number, scene: Scene) { 
        this.ticks += ticks;
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
