export const Orientations = ["horizontal", "vertical"] as const;

export type Orientation = (typeof Orientations)[number];

export class OrientationHelper {
    static rotate(orientation: Orientation): Orientation {
        return orientation === "horizontal"
            ? "vertical"
            : "horizontal"
    }
}
