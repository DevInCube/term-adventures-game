import { Scene } from "../Scene";
import { Face } from "../data/Face";
import { Sides } from "../data/Sides";
import { Vector2 } from "../data/Vector2";

export const SignalTypes = ["light", "life", "fire", "weather", "mind", "darkness"] as const;
export type SignalType =  (typeof SignalTypes)[number];;

export type Signal = {
    type: SignalType;
    value: number;
}

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

export type SignalTransfer = {
    signal: Signal;
    direction: Face;
}

export interface ISignalProcessor {
    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[];
}

export function isAnISignalProcessor(obj: object): obj is ISignalProcessor {
    return (
        "processSignalTransfer" in obj && 
        typeof obj.processSignalTransfer === "function"
    );
}