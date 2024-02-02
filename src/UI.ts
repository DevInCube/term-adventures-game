import { Scene } from "./engine/Scene";
import { Camera } from "./engine/cameras/Camera";

export class UI extends Scene {
    constructor(private camera: Camera) {
        super();
    }

    update(ticks: number): void {
        super.update(ticks);
        this.position = this.camera.position.clone();
    }
}
