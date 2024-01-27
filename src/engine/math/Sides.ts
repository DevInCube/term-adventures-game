import { Face, Faces } from "./Face";
import { Orientation } from "./Orientation";

export type Sides = { [key in Face]?: boolean };

export class SidesHelper {
    static horizontal(): Sides {
        return { left: true, right: true, };
    }

    static vertical(): Sides {
        return { top: true, bottom: true, };
    }

    static all() {
        return Object.fromEntries(Faces.map(x => [x, true]));
    }
    
    static fromOrientation(orientation: Orientation) {
        return orientation === "horizontal"
            ? this.horizontal()
            : this.vertical();
    }
}
