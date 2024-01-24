import { Vector2 } from "./Vector2";

export class Box2 {
    constructor(
        public min: Vector2,
        public max: Vector2
    ) {

    }

    public clone(): Box2 {
        return new Box2(this.min.clone(), this.max.clone());
    }

    public containsPoint(position: Vector2): boolean {
        return (
            position.x >= this.min.x && 
            position.y >= this.min.y && 
            position.x <= this.max.x &&
            position.y <= this.max.y
        );
    }

    public expandByVector(v: Vector2): Box2 {
        this.min.sub(v);
        this.max.add(v);
        return this;
    }
}
