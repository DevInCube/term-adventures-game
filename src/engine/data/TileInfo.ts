import { ObjectPhysics } from "../components/ObjectPhysics";
import { Effect } from "../effects/Effect";
import { TileCategory } from "../objects/TileCategory";
import { Sprite } from "./Sprite";

export class TileInfo {
    effects: Effect[] = [];
    disturbanceSprite: Sprite | undefined;
    objectPhysics: ObjectPhysics | undefined;

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

    addPhysics(physics: ObjectPhysics) {
        this.objectPhysics = physics;
        return this;
    }
}
