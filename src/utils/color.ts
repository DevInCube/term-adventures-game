export function numberToHexColor(val: number, max: number = 15, min: number = 0): string {
    const length = max - min;
    const intVal = Math.round(val) | 0;
    const red = Math.floor((intVal / length) * 255);
    const blue = 255 - red;
    return `rgba(${red}, 0, ${blue}, 0.3)`;
}
