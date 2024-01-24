import { Vector2 } from "../engine/data/Vector2";

export function fillLayer<T>(size: Vector2, defaultValue: T, layer: T[][] = []): T[][] {
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

    return layer;
}

export function fillLayerWith<T>(size: Vector2, valueFactory: (pos: Vector2) => T, layer: T[][] = []): T[][] {
    for (let y = 0; y < size.height; y++) {
        if (!layer[y]) {
            layer[y] = [];
        }

        for (let x = 0; x < size.width; x++) {
            layer[y][x] = valueFactory(new Vector2(x, y));
        }
    }

    return layer;
}

export function forLayerOf<T>(layer: T[][], iteration: (v: T) => void, defaultValue: T) {
    for (let y = 0; y < layer.length; y++) {
        for (let x = 0; x < layer[y].length; x++) {
            iteration(layer[y][x] || defaultValue);
        }
    }
}

export function forLayer<T>(layer: T[][], iteration: (l: T[][], position: Vector2, v: T) => void) {
    for (let y = 0; y < layer.length; y++) {
        for (let x = 0; x < layer[y].length; x++) {
            iteration(layer, new Vector2(x, y), layer[y][x]);
        }
    }
}

export function mapLayer<T1, T2>(layer: T1[][], converter: (v: T1, pos: Vector2) => T2) {
    const newLayer: T2[][] = []; 
    for (let y = 0; y < layer.length; y++) {
        if (!newLayer[y]) {
            newLayer[y] = [];
        }

        for (let x = 0; x < layer[y].length; x++) {
            newLayer[y][x] = converter(layer[y][x], new Vector2(x, y));
        }
    }

    return newLayer;
}