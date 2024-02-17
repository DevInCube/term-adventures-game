export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

// Cumulative moving average.
export function average(values: number[]) {
	return values.reduce((a, x, i) => a + (x - a) / (i + 1), 0);
}