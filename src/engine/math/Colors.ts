import { Color } from "./Color";

export class Colors {
    public static Transparent = new Color(0, 0, 0, 0);

    public static Black = new Color(0, 0, 0, 1);
    public static White = new Color(1, 1, 1, 1);
    public static Red = new Color(1, 0, 0, 1);
    public static Green = new Color(0, 1, 0, 1);
    public static Blue = new Color(0, 0, 1, 1);
    public static Yellow = new Color(1, 1, 0, 1);
    public static Purple = new Color(1, 0, 1, 1);
    public static Violet = new Color(0.5, 0, 0.5, 1);
    public static Orange = new Color(1, 0.5, 0, 1);
    public static Brown = new Color(0.5, 0.25, 0, 1);
    public static Gray = new Color(0.5, 0.5, 0.5, 1);
    public static Cyan = new Color(0, 1, 1, 1);
    public static Lime = new Color(0.5, 1, 0, 1);
    public static Sienna = new Color(0.533, 0.176, 0.09, 1);
    public static SaddleBrown = new Color(0.533, 0.176, 0.09, 1);

    // Light colors
    public static LightRed = new Color(1, 0.5, 0.5, 1);
    public static LightGreen = new Color(0.5, 1, 0.5, 1);
    public static LightBlue = new Color(0.5, 0.5, 1, 1);
    public static LightYellow = new Color(1, 1, 0.5, 1);
    public static LightPurple = new Color(1, 0.5, 1, 1);
    public static LightOrange = new Color(1, 0.75, 0.5, 1);
    public static LightBrown = new Color(0.75, 0.375, 0, 1);
    public static LightGray = new Color(0.75, 0.75, 0.75, 1);

    // Dark colors
    public static DarkRed = new Color(0.5, 0, 0, 1);
    public static DarkGreen = new Color(0, 0.5, 0, 1);
    public static DarkBlue = new Color(0, 0, 0.5, 1);
    public static DarkYellow = new Color(0.5, 0.5, 0, 1);
    public static DarkPurple = new Color(0.5, 0, 0.5, 1);
    public static DarkOrange = new Color(0.5, 0.25, 0, 1);
    public static DarkBrown = new Color(0.25, 0.125, 0, 1);
    public static DarkGray = new Color(0.25, 0.25, 0.25, 1);
}