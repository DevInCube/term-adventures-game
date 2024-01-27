import { Face } from "../math/Face";
import { Sides } from "../math/Sides";
import { Vector2 } from "../math/Vector2";

export const SignalTypes = ["light", "life", "fire", "weather", "mind", "darkness"] as const;
export const SignalColors = ["white", "green", "red", "cyan", "yellow", "blue"] as const;
export type SignalType =  (typeof SignalTypes)[number];;

export type Signal = {
    type: SignalType;
    value: number;
}

export type SignalCell = {
    position: Vector2;
    inputSides?: Sides;
    sides: Sides;
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