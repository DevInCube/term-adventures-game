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
    initiator: Npc
};
export type GameObjectAction = (ctx: GameObjectActionContext) => void;
export type UpdateHandler = (ticks: number, obj: SceneObject, scene: Scene) => void;
export type GameObjectEventHandler = (obj: SceneObject, ev: GameEvent) => void;

export type ObjectActionType = "interaction" | "collision";

export type ObjectAction = {
    type: ObjectActionType;
    position: [number, number];
    callback: GameObjectAction;
    iconPosition: [number, number];
}

type SetActionOptions = { type?: ObjectActionType, position?: [number, number], action: GameObjectAction, iconPosition?: [number, number]};

export interface Drawable {
    draw(ctx: CanvasContext) : void;
}

export class SceneObject implements GameEventHandler {
    public scene: Scene | null = null;
    public level: Level | null = null;
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

    constructor(
        public originPoint: [number, number],
        public skin: ObjectSkin,
        public physics: ObjectPhysics,
        public position: [number, number]) {
        
        //
    }

    bindToLevel(level: Level) {
        this.level = level;
    }

    // add cb params
    setAction(arg: SetActionOptions | GameObjectAction) {
        if (typeof arg === "function") {
            this.setAction(<SetActionOptions>{ action: arg as GameObjectAction});
            return;
        }

        const options = arg as SetActionOptions;
        if (options) {
            const type = options.type || "interaction";
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
}
