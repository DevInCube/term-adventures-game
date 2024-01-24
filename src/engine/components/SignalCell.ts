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

export interface ISignalInit {
    initialize(): void;
}

export interface ISignalSource {
    updateSource(scene: Scene): SignalTransfer[];
}

export interface ISignalProcessor {
    processSignalTransfer(transfer: SignalTransfer): SignalTransfer[];
}

export function isAnISignalInit(obj: object): obj is ISignalInit {
    return (
        "initialize" in obj && 
        typeof obj.initialize === "function"
    );
}

export function isAnISignalSource(obj: object): obj is ISignalSource {
    return (
        "updateSource" in obj && 
        typeof obj.updateSource === "function"
    );
}

export function isAnISignalProcessor(obj: object): obj is ISignalProcessor {
    return (
        "processSignalTransfer" in obj && 
        typeof obj.processSignalTransfer === "function"
    );
}