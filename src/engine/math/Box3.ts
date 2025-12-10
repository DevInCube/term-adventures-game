import { Vector3 } from "./Vector3";

export class Box3 {
    constructor(
        public min: Vector3,
        public max: Vector3,
    ) {

    }

    public clone(): Box3 {
        return new Box3(this.min.clone(), this.max.clone());
    }

    public containsPoint(position: Vector3): boolean {
        return (
            position.x >= this.min.x && 
            position.y >= this.min.y && 
            position.z >= this.min.z &&
            position.x <= this.max.x &&
            position.y <= this.max.y &&
            position.z <= this.max.z
        );
    }

    public expandByVector(v: Vector3): Box3 {
        this.min.sub(v);
        this.max.add(v);
        return this;
    }
}
