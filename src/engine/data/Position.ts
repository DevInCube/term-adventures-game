import { Face } from "./Face";

export class Position {
    constructor(
        public readonly x: number,
        public readonly y: number,
    ) {
    }

    public plus(p: Position): Position {
        return new Position(this.x + p.x, this.y + p.y);
    }

    public minus(p: Position): Position {
        return new Position(this.x - p.x, this.y - p.y);
    }

    public negative(): Position {
        return new Position(-this.x, -this.y);
    }

    public to(): [number, number] {
        return [this.x, this.y];
    }

    static from([x, y]: [number, number]) {
        return new Position(x, y);
    }

    static top = new Position(0, -1);

    static bottom = new Position(0, +1);

    static left = new Position(-1, 0);

    static right = new Position(+1, 0);

    static fromFace(face: Face): Position {
        switch (face) {
            case "top": return Position.top;
            case "right": return Position.right;
            case "bottom": return Position.bottom;
            case "left": return Position.left;
        }
    }

    static add(p1: [number, number], p2: [number, number]): [number, number] {
        return [
            p1[0] + p2[0],
            p1[1] + p2[1],
        ];
    }
}
