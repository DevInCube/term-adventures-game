export class Vector3 {

    public get width() {
        return this.x;
    }

    public get height() {
        return this.y;
    }

    public get depth() {
        return this.z;
    }

    public get length() {
        return this.distanceTo(Vector3.zero);
    }
    
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
    ) {
    }

    public copy(v: Vector3) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    public clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    public distanceTo(v: Vector3): number {
        return Math.sqrt(
            (this.x - v.x) ** 2 + 
            (this.y - v.y) ** 2) +
            (this.z - v.z) ** 2;
    }

    public equals(p: Vector3): boolean {
        return (
            this.x === p.x &&
            this.y === p.y &&
            this.z === p.z
        );
    }

    public getAt(index: number): number {
		switch (index) {
			case 0: return this.x;
			case 1: return this.y;
            case 2: return this.z
			default: throw new Error(`Index is out of range: ${index}`);
		}
	}

    public setAt(index: number, value: number): Vector3 {
		switch (index) {
			case 0: this.x = value; break;
			case 1: this.y = value; break;
            case 2: this.z = value; break;
			default: throw new Error(`Index is out of range: ${index}`);
		}

		return this;
	}

    public add(v: Vector3): Vector3 {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    public sub(v: Vector3): Vector3 {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    public multiply(v: Vector3): Vector3  {
		this.x *= v.x;
		this.y *= v.y;
        this.z *= v.z;
		return this;
	}

    public multiplyScalar(s: number): Vector3 {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    public negate(): Vector3 {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    public max(v: Vector3): Vector3 {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
    }

    public to(): [number, number, number] {
        return [this.x, this.y, this.z];
    }

    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }

    static from([x, y, z]: [number, number, number]) {
        return new Vector3(x, y, z);
    }

    static get zero() {
        return new Vector3();
    }

    static get top() {
        return new Vector3(0, -1, 0);
    } 

    static get bottom() {
        return new Vector3(0, +1, 0);
    }

    static get left() {
        return new Vector3(-1, 0, 0);
    }

    static get right() {
        return new Vector3(+1, 0, 0);
    }

    static get front() {
        return new Vector3(0, 0, 1);
    }

    static get back() {
        return new Vector3(0, 0, -1);
    }

    static get directions() {
        return [
            Vector3.right,
            Vector3.bottom,
            Vector3.left,
            Vector3.top,
            Vector3.front,
            Vector3.back,
        ];
    }

    static add(p1: Vector3, p2: Vector3): Vector3 {
        return p1.add(p2);
    }
}
