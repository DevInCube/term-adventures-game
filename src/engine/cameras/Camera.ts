import { Level } from "../Level";
import { Box2 } from "../math/Box2";
import { Box3 } from "../math/Box3";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";
import { Object2D } from "../objects/Object2D";

export const followOffset: number = 4;

export class Camera extends Object2D {
    size: Vector2 = new Vector2(48, 32);

    get box() {
        const position = this.getWorldPosition(new Vector2());
        const position2 = position.clone().add(this.size);
        return new Box2(position, position2);
    }

    get box3() {
        const position = this.getWorldPosition(new Vector2());
        const position2 = position.clone().add(this.size);
        const height = Level.defaultMaxDepth;
        return new Box3(
            new Vector3(position.x, position.y, 0), 
            new Vector3(position2.x, position2.y, height),
        );
    }
}
