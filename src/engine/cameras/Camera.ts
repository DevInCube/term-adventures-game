import { Box2 } from "../math/Box2";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";

export const followOffset: number = 4;

export class Camera extends Object2D {
    size: Vector2 = new Vector2(20, 20);

    get box() {
        const position = this.getWorldPosition(new Vector2());
        return new Box2(
            position, 
            position.clone().add(this.size));
    }
}
