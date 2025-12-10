import { Color } from "../engine/math/Color";
import { clamp } from "./math";

export function numberToColor(val: number, max: number = 15, min: number = 0): Color {
    const length = max - min;
    const intVal = Math.round(val) | 0;
    const red = Math.round(intVal / length);
    const blue = Math.round((255 - red) / 255);
    return new Color(red, 0, blue, 1);
}
export function rgbToHsl(
    r: number,
    g: number,
    b: number,
    a: number
): [number, number, number, number] {

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Lightness
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }

        h *= 60;
        if (h < 0) h += 360;
    }

    return [h, s, l, a];
}

function _clamp01(value: number): number {
    return clamp(value, 0, 1);
}

export function hslToRgb(
    h: number,
    s: number,
    l: number,
    a: number = 1
): Color {

    // Clamp inputs first (defensive)
    h = ((h % 360) + 360) % 360;
    s = _clamp01(s);
    l = _clamp01(l);
    a = _clamp01(a);

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = h / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));

    let r1 = 0, g1 = 0, b1 = 0;

    if (hp >= 0 && hp < 1) { r1 = c; g1 = x; b1 = 0; }
    else if (hp >= 1 && hp < 2) { r1 = x; g1 = c; b1 = 0; }
    else if (hp >= 2 && hp < 3) { r1 = 0; g1 = c; b1 = x; }
    else if (hp >= 3 && hp < 4) { r1 = 0; g1 = x; b1 = c; }
    else if (hp >= 4 && hp < 5) { r1 = x; g1 = 0; b1 = c; }
    else { r1 = c; g1 = 0; b1 = x; }

    const m = l - c / 2;

    return new Color(
        _clamp01(r1 + m),
        _clamp01(g1 + m),
        _clamp01(b1 + m),
        a,
    );
}

export function mixColors(colors: { color: Color, intensity: number }[]): Color {
    const totalIntensity = clamp(colors.reduce((a, x) => a += x.intensity / 15, 0), 0, 1);
    const mixedColor: Color = new Color(
        clamp(colors.reduce((a, x) => a += x.color.r * (x.intensity / 15), 0) / totalIntensity, 0, 1),
        clamp(colors.reduce((a, x) => a += x.color.g * (x.intensity / 15), 0) / totalIntensity, 0, 1),
        clamp(colors.reduce((a, x) => a += x.color.b * (x.intensity / 15), 0) / totalIntensity, 0, 1),
    );
    return mixedColor;
}
