import { Color } from "../engine/math/Color";

export function numberToHexColor(val: number, max: number = 15, min: number = 0): string {
    const length = max - min;
    const intVal = Math.round(val) | 0;
    const red = Math.floor((intVal / length) * 255);
    const blue = 255 - red;
    return `rgba(${red}, 0, ${blue})`;
}

export function hslToRgb(h: number, s: number, l: number): Color {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(color);
    };
    return new Color(f(0), f(8), f(4));
}

export function mixColors(colors: { color: Color, intensity: number }[]): Color {
    const totalIntensity = Math.min(1, colors.reduce((a, x) => a += x.intensity / 15, 0));
    const mixedColor: Color = new Color(
        Math.min(1, colors.reduce((a, x) => a += x.color.r * (x.intensity / 15), 0) / totalIntensity),
        Math.min(1, colors.reduce((a, x) => a += x.color.g * (x.intensity / 15), 0) / totalIntensity),
        Math.min(1, colors.reduce((a, x) => a += x.color.b * (x.intensity / 15), 0) / totalIntensity),
    );
    return mixedColor;
}
