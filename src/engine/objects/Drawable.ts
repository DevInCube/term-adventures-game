import { CanvasContext } from "../graphics/CanvasContext";


export interface Drawable {
    draw(ctx: CanvasContext): void;
}
