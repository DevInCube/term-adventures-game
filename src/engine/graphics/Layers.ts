
export const Layers = ["objects", "particles", "ui"] as const;
export type Layer = (typeof Layers)[number];