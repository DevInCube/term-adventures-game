import { Vector2 } from "../engine/data/Vector2";

export function fillLayer<T>(layer: T[][], size: Vector2, defaultValue: T) {
    for (let y = 0; y < size.height; y++) {
        if (!layer[y]) {
            layer[y] = [];
        }

        for (let x = 0; x < size.width; x++) {
            if (!layer[y][x]) {
                layer[y][x] = defaultValue;
            }
        }
    }
}

export function forLayerOf<T>(layer: T[][], iteration: (v: T) => void, defaultValue: T) {
    for (let y = 0; y < layer.length; y++) {
        for (let x = 0; x < layer[y].length; x++) {
            iteration(layer[y][x] || defaultValue);
        }
    }
}

export function forLayer<T>(layer: T[][], iteration: (l: T[][], x: number, y: number) => void) {
    for (let y = 0; y < layer.length; y++) {
        for (let x = 0; x < layer[y].length; x++) {
            iteration(layer, x, y);
        }
    }
}