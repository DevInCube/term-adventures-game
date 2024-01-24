import { GameEvent, GameEventHandler } from "../events/GameEvent";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Scene } from "../Scene";
import { CanvasContext } from "../graphics/CanvasContext";
import { Npc } from "./Npc";
import { Inventory } from "./Inventory";
import { Level } from "../Level";
import { Vector2 } from "../data/Vector2";

export type GameObjectActionContext = {
    obj: SceneObject
    initiator: Npc,
    subject: SceneObject | undefined,
};
export type GameObjectAction = (ctx: GameObjectActionContext) => void;
export type UpdateHandler = (ticks: number, obj: SceneObject, scene: Scene) => void;
export type GameObjectEventHandler = (obj: SceneObject, ev: GameEvent) => void;

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

export interface Drawable {
    draw(ctx: CanvasContext) : void;
}

export class SceneObject implements GameEventHandler {
    private _level: Level | null = null;

    public scene: Scene | null = null;
    public parent: SceneObject | null = null;
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

    get children(): SceneObject[] {
        return [];
    }

    get position(): Vector2 {
        return (this.parent?.position?.clone() || Vector2.zero).add(this._position);
    }

    set position(value: Vector2) {
        if (!this.position.equals(value)) {
            this._position = value.clone();
        }
    }

    get level(): Level | null {
        return this._level;
    }

    set level(value: Level | null) {
        if (this._level !== value) {
            this._level = value;
        }
    }

    constructor(
        public originPoint: Vector2,
        public skin: ObjectSkin,
        public physics: ObjectPhysics,
        private _position: Vector2) {
        
        //
    }

    bindToLevel(level: Level) {
        this.level = level;
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
