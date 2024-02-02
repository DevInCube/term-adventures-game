import { SignalTransfer } from "./SignalTransfer";

export interface ISignalProcessor {
    processSignalTransfer(transfers: SignalTransfer[]): SignalTransfer[];
}

export function isAnISignalProcessor(obj: object): obj is ISignalProcessor {
    return (
        "processSignalTransfer" in obj && 
        typeof obj.processSignalTransfer === "function"
    );
}