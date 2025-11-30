import { Sprite } from "../engine/data/Sprite";
import { SpriteAnimation } from "../engine/objects/SpriteAnimation";
import { UIElement } from "./UIElement";

export class UIAnimationObject extends UIElement {
    private _animation: SpriteAnimation;

    constructor(
        parent: UIElement,
        sprite: Sprite,
    ) {
        super(parent);
        this._animation = new SpriteAnimation(sprite);
        this._animation.play({ isLooped: true });
    }

    update(ticks: number): void {
        super.update(ticks);
        this._animation.update(ticks);
        this.skin = this._animation.getFrame();
    }
}
