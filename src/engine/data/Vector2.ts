import { Face } from "./Face";

export class Vector2 {

    public get width() {
        return this.x;
    }

    public get height() {
        return this.y;
    }

    public get length() {
        return this.distanceTo(Vector2.zero);
    }

    constructor(
        public x: number = 0,
        public y: number = 0,
    ) {
    }

    public clone() {
        return new Vector2(this.x, this.y);
    }

    public distanceTo(v: Vector2): number {
        return Math.sqrt(
            (this.x - v.x) ** 2 + 
            (this.y - v.y) ** 2);
    }

    public equals(p: Vector2): boolean {
        return (
            this.x === p.x &&
            this.y === p.y
        );
    }

    public getAt(index: number): number {
		switch (index) {
			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error(`Index is out of range: ${index}`);
		}
	}

    public setAt(index: number, value: number): Vector2 {
		switch (index) {
			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error(`Index is out of range: ${index}`);
		}

		return this;
	}

    public add(v: Vector2): Vector2 {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    public sub(v: Vector2): Vector2 {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    public multiplyScalar(s: number): Vector2 {
        this.x *= s;
        this.y *= s;
        return this;
    }

    public negate(): Vector2 {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    public max(v: Vector2): Vector2 {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    }

    public to(): [number, number] {
        return [this.x, this.y];
    }

    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }

    static from([x, y]: [number, number]) {
        return new Vector2(x, y);
    }

    static get zero() {
        return new Vector2();
    }

    static get top() {
        return new Vector2(0, -1);
    } 

    static get bottom() {
        return new Vector2(0, +1);
    }

    static get left() {
        return new Vector2(-1, 0);
    }

    static get right() {
        return new Vector2(+1, 0);
    }

    static fromFace(face: Face): Vector2 {
        switch (face) {
            case "top": return Vector2.top;
            case "right": return Vector2.right;
            case "bottom": return Vector2.bottom;
            case "left": return Vector2.left;
        }
    }

    static add(p1: Vector2, p2: Vector2): Vector2 {
        return p1.add(p2);
    }
}
