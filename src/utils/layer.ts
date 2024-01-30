import { Vector2 } from "../engine/math/Vector2";

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

export type LayerValueFactory<T> = (position: Vector2, layer: T[][]) => T;

export function fillLayerWith<T>(size: Vector2, valueFactory: LayerValueFactory<T>, layer: T[][] = []): T[][] {
    const position = new Vector2(0, 0);
    for (position.y = 0; position.y < size.height; position.y++) {
        if (!layer[position.y]) {
            layer[position.y] = [];
        }

        for (position.x = 0; position.x < size.width; position.x++) {
            const newValue = valueFactory(position, layer);
            layer[position.y][position.x] = newValue;
        }
    }

    return layer;
}

export type LayerValueIterator<T> = (value: T, position: Vector2, layer: T[][]) => void;

export function forLayer<T>(layer: T[][], iteration: LayerValueIterator<T>): void {
    const position = new Vector2(0, 0);
    const height = layer.length;
    for (position.y = 0; position.y < height; position.y++) {
        const width = layer[position.y].length;
        for (position.x = 0; position.x < width; position.x++) {
            const value = layer[position.y][position.x];
            iteration(value, position, layer);
        }
    }
}

export type LayerValueConverter<T1, T2> = (value: T1, position: Vector2, layer: T1[][]) => T2;

export function mapLayer<T1, T2>(layer: T1[][], converter: LayerValueConverter<T1, T2>): T2[][] {
    const newLayer: T2[][] = [];
    const position = new Vector2(0, 0);
    const height = layer.length;
    for (position.y = 0; position.y < height; position.y++) {
        if (!newLayer[position.y]) {
            newLayer[position.y] = [];
        }

        const width = layer[position.y].length;
        for (position.x = 0; position.x < width; position.x++) {
            const oldValue = layer[position.y][position.x];
            const newValue = converter(oldValue, position, layer);
            newLayer[position.y][position.x] = newValue;
        }
    }

    return newLayer;
}