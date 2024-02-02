import { Vector2 } from "../math/Vector2";

export class SpriteInfo {
    size: Vector2 = new Vector2();
    name: string;
    empty: string;

    get width() {
        return this.size.width;
    }

    get height() {
        return this.size.height;
    }
}
