import { Cell } from "./graphics/Cell";
import { SceneObject } from "./objects/SceneObject";
import { Tile } from "./objects/Tile";

export class Level {
    public blockedLayer: boolean[][] = [];
    public transparencyLayer: number[][] = [];
    public lightLayer: number[][] = [];
    public lightColorLayer: [number, number, number][][] = [];
    public weatherTicks: number = 0;
    public temperatureTicks: number =  0;
    public temperatureLayer: number[][] = [];
    public moistureLayer: number[][] = [];
    public weatherLayer: Cell[][] = [];
    public cloudLayer: number[][] = [];
    public roofLayer: number[][] = [];
    public roofHolesLayer: boolean[][] = [];
    public weatherType = 'normal';
    public isWindy = true;
    public ambientLightColor: [number, number, number] = [255, 255, 255];
    public portals: { [portal_id: string]: [number, number][] } = {};
    public width: number;
    public height: number;

    constructor(
        public id: string,
        public objects: SceneObject[],
        public tiles: Tile[][]
    ) {
        this.height = tiles.length;
        this.width = this.height > 0 ? tiles[0].length : 0;

        for (const object of objects) {
            object.bindToLevel(this);
        }
    }

    update(ticks: number) {
        this.weatherTicks += ticks;
        this.temperatureTicks += ticks;
    }
}