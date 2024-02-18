import { Effect } from "../effects/Effect";
import { TileCategory } from "../objects/TileCategory";

export class TileInfo {
    effects: Effect[] = [];

    constructor(
        public color: string = 'transparent',
        public type: string = 'undefined_tile',
        public category: TileCategory = "solid",
    ) {
    }

    addEffect(effect: Effect) {
        this.effects.push(effect);
        return this;
    }
}
