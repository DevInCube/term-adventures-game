import { GameEvent, GameEventHandler } from "../events/GameEvent";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Scene } from "../Scene";
import { CanvasContext } from "../graphics/CanvasContext";
import { Npc } from "./Npc";
import { Inventory } from "./Inventory";
import { Level } from "../Level";

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
    position: [number, number];
    callback: GameObjectAction;
    iconPosition: [number, number];
}

type SetActionOptions = {
    type?: ObjectActionType,
    position?: [number, number],
    action: GameObjectAction,
    iconPosition?: [number, number],
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

    get position() {
        return [
            (this.parent?.position[0] || 0) + this._position[0],
            (this.parent?.position[1] || 0) + this._position[1]
        ];
    }

    set position(value: [number, number]) {
        if (this.position[0] !== value[0] || this.position[1] !== value[1]) {
            this._position = [...value];
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
        public originPoint: [number, number],
        public skin: ObjectSkin,
        public physics: ObjectPhysics,
        private _position: [number, number]) {
        
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

            const position = options.position || [0, 0];
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
