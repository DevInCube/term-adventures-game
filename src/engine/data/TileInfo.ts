import { Effect } from "../effects/Effect";
import { TileCategory } from "../objects/TileCategory";
import { Sprite } from "./Sprite";

export class TileInfo {
    effects: Effect[] = [];
    disturbanceSprite: Sprite | undefined;

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

    addDisturbanceSprite(sprite: Sprite) {
        this.disturbanceSprite = sprite;
        return this;
    }
}
