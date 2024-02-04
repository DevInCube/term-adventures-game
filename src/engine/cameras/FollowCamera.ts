import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";
import { Camera, followOffset } from "./Camera";

export class FollowCamera extends Camera {

    constructor(
        public followObject: Object2D,
        private boundingSize: Vector2
    ) {
        super();
        this.followObject = followObject;
        this.boundingSize = boundingSize;
    }

    update(ticks: number) {
        super.update(ticks);
        const cameraRightBottom = this.position.clone().add(this.size).sub(new Vector2(1, 1));

        const leftRel = this.followObject.position.x - this.position.x;
        if (leftRel < followOffset) {
            this.position.x = (Math.max(0, this.followObject.position.x - followOffset));
        }

        const topRel = this.followObject.position.y - this.position.y;
        if (topRel < followOffset) {
            this.position.y = (Math.max(0, this.followObject.position.y - followOffset));
        }

        const rightRel = cameraRightBottom.x - this.followObject.position.x;
        if (rightRel < followOffset) {
            this.position.x = (Math.min(this.boundingSize.width - this.size.width, this.followObject.position.x - (this.size.width - 1) + followOffset));
        }

        const bottomRel = cameraRightBottom.y - this.followObject.position.y;
        if (bottomRel < followOffset) {
            this.position.y = (Math.min(this.boundingSize.height - this.size.height, this.followObject.position.y - (this.size.height - 1) + followOffset));
        }

        if (cameraRightBottom.x > this.boundingSize.width) {
            this.position.x = (this.boundingSize.width - this.size.width);
        }

        if (cameraRightBottom.y > this.boundingSize.height) {
            this.position.y = (this.boundingSize.height - this.size.height);
        }
    }
}
