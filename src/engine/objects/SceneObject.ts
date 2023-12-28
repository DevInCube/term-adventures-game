import { GameEvent, GameEventHandler } from "../events/GameEvent";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectPhysics } from "../components/ObjectPhysics";
import { Scene } from "../Scene";
import { CanvasContext } from "../graphics/CanvasContext";
import { Npc } from "./Npc";
import { Inventory } from "./Inventory";

export type GameObjectActionContext = {
    obj: SceneObject
    initiator: Npc
};
export type GameObjectAction = (ctx: GameObjectActionContext) => void;
export type UpdateHandler = (ticks: number, obj: SceneObject, scene: Scene) => void;
export type GameObjectEventHandler = (obj: SceneObject, ev: GameEvent) => void;

export type ObjectAction = [[number, number], GameObjectAction, [number, number]];

export interface Drawable {
    draw(ctx: CanvasContext) : void;
}

export class SceneObject implements GameEventHandler {
    public scene: Scene | null = null;
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

    // add cb params
    setAction(left: number, top: number, action: GameObjectAction, ileft: number = left, itop: number = top) {
        this.actions.push([[left, top], action, [ileft, itop]]);
    }

    handleEvent(ev: GameEvent) { }

    update(ticks: number, scene: Scene) { 
        this.ticks += ticks;
    }
}
