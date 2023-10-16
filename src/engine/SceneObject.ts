import { GameEvent, GameEventHandler } from "./GameEvent";
import { ObjectSkin } from "./ObjectSkin";
import { ObjectPhysics } from "./ObjectPhysics";
import { Scene } from "./Scene";
import { deepCopy } from "../utils/misc";
import { CanvasContext } from "./GraphicsEngine";

export type GameObjectAction = (obj: SceneObject) => void;
export type UpdateHandler = (ticks: number, obj: SceneObject, scene: Scene) => void;
export type GameObjectEventHandler = (obj: SceneObject, ev: GameEvent) => void;

export interface Drawable {
    draw(ctx: CanvasContext) : void;
}

export class SceneObject implements GameEventHandler {
    public enabled = true;
    public highlighted = false;
    public highlighColor: string = '#0ff';
    public important = false;
    public parameters: {[key: string]: any} = {};
    public actions: [[number, number], GameObjectAction, [number, number]][] = [];
    ticks: number = 0;

    constructor(
        public originPoint: [number, number],
        public skin: ObjectSkin,
        public physics: ObjectPhysics,
        public position: [number, number]) {
        
        //
    }

    new() { return new SceneObject([0, 0], new ObjectSkin(), new ObjectPhysics(), [0, 0]); }

    // add cb params
    setAction(left: number, top: number, action: GameObjectAction, ileft: number = left, itop: number = top) {
        this.actions.push([[left, top], action, [ileft, itop]]);
    }

    handleEvent(ev: GameEvent) { }

    update(ticks: number, scene: Scene) { 
        this.ticks += ticks;
    }
}
