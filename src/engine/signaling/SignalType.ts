export const SignalTypes = ["light", "life", "fire", "weather", "mind", "darkness"] as const;
export type SignalType = (typeof SignalTypes)[number];
export const SignalColors = ["white", "green", "red", "cyan", "yellow", "blue"] as const;
