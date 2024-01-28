export type GameMode = (typeof GameModes)[number];
export const GameModes = ["scene", "dialog", "inventory"] as const;
