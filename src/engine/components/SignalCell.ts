import { Sides } from "../data/Sides";

export type SignalCell = {
    position: [number, number];
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
