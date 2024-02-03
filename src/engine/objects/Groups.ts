import { Object2D } from "./Object2D";

export class Group extends Object2D {
    constructor() {
        super();
        this.type = "group";
    }
}