import { Color } from "../math/Color";
import { Light } from "./Light";

export class SkyLight extends Light {
    constructor(color: Color, intensity: number) {
        super(color, intensity);

        this.type = "sky_light";
    }
}
