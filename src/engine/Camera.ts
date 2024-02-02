import { Vector2 } from "./math/Vector2";

export const followOffset: number = 4;

export class Camera {
    position: Vector2 = Vector2.zero;
    size: Vector2 = new Vector2(20, 20);

    update() {
    }
}
