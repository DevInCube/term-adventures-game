import { Cell } from "./graphics/Cell";
import { SceneObject } from "./objects/SceneObject";

export class Level {

    public portals: { [portal_id: string]: [number, number][] } = {};

    constructor(
        public id: string,
        public sceneObjects: SceneObject[],
        public tiles: (Cell | null)[][] = [],
        public width: number = 20,
        public height: number = 20,
    ) {

    }
}