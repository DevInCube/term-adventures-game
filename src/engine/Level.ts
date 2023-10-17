import { Cell } from "./Cell";
import { SceneObject } from "./SceneObject";

export class Level {
    constructor(
        public sceneObjects: SceneObject[],
        public tiles: (Cell | null)[][] = [],
        public width: number = 20,
        public height: number = 20,
    ) {

    }
}