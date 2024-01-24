import { Sides } from "../data/Sides";
import { Vector2 } from "../data/Vector2";

export type SignalCell = {
    position: Vector2;
    inputSides?: Sides;
    sides: Sides;
    sourceOf?: number;
    detectorOf?: {
        light?: number;
        weather?: number;
        life?: number;
        fire?: number;
    };
    invertorOf?: boolean;
};
