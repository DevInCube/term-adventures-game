export function numberToHexColor(val: number, max: number = 15, min: number = 0): string {
    const length = max - min;
    const intVal = Math.round(val) | 0;
    const red = Math.floor((intVal / length) * 255);
    const blue = 255 - red;
    return `rgba(${red}, 0, ${blue}, 0.3)`;
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
    };
    return [f(0), f(8), f(4)];
}

export function mixColors(colors: { color: [number, number, number], intensity: number }[]): [number, number, number] {
    const totalIntensity = Math.min(1, colors.reduce((a, x) => a += x.intensity / 15, 0));
    const mixedColor: [number, number, number] = [
        Math.min(255, colors.reduce((a, x) => a += x.color[0] * (x.intensity / 15), 0) / totalIntensity | 0),
        Math.min(255, colors.reduce((a, x) => a += x.color[1] * (x.intensity / 15), 0) / totalIntensity | 0),
        Math.min(255, colors.reduce((a, x) => a += x.color[2] * (x.intensity / 15), 0) / totalIntensity | 0),
    ];
    return mixedColor;
}
