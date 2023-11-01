import { Cell } from "./graphics/Cell";
import { SceneObject } from "./objects/SceneObject";

export class Level {
    public blockedLayer: boolean[][] = [];
    public lightLayer: number[][] = [];
    public weatherTicks: number = 0;
    public temperatureTicks: number =  0;
    public temperatureLayer: number[][] = [];
    public moistureLayer: number[][] = [];
    public weatherLayer: Cell[][] = [];
    public cloudLayer: number[][] = [];
    public roofLayer: number[][] = [];
    public wallsLayer: number[][] = [];
    public weatherType = 'normal';
    public isWindy = true;
    public portals: { [portal_id: string]: [number, number][] } = {};

    constructor(
        public id: string,
        public objects: SceneObject[],
        public tiles: (Cell | null)[][] = [],
        public width: number = 20,
        public height: number = 20,
    ) {

    }
}