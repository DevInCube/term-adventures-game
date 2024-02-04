import { Box2 } from "./Box2";
import { Vector2 } from "./Vector2";

export type GridIterator<T> = (value: T, position: Vector2, grid: Grid<T>) => void;
export type GridValueFactory<T> = (position: Vector2, grid: Grid<T>) => T;
export type GridValueConverter<T, T2> = (value: T, position: Vector2, grid: Grid<T>) => T2;

export class Grid<T> {
    private _elements: T[] = [];

    get width() {
        return this.size.width;
    }

    get height() {
        return this.size.height;
    }

    constructor(
        public readonly size: Vector2
    ) {
    }
    
    public at(position: Vector2) {
        return this._elements[position.y * this.size.width + position.x];
    }

    public setAt(position: Vector2, value: T) {
        this._elements[position.y * this.size.width + position.x] = value;
    }
    
    public containsPosition([x, y]: Vector2): boolean {
        return (
            x >= 0 && 
            x < this.size.width && 
            y >= 0 &&
            y < this.size.height
        );
    }

    public traverse(iteration: GridIterator<T>): void {
        const position = new Vector2();
        for (position.y = 0; position.y < this.height; position.y++) {
            for (position.x = 0; position.x < this.width; position.x++) {
                const value = this.at(position);
                iteration(value, position, this);
            }
        }
    }

    public fillValue(value: T) {
        this.traverse((_, pos) => this.setAt(pos, value));
        return this;
    }

    public fill(factory: GridValueFactory<T>) {
        this.traverse((_, position) => {
            const newValue = factory(position, this);
            this.setAt(position, newValue);
        });
        return this;
    }

    public map<T2>(converter: GridValueConverter<T, T2>): Grid<T2> {
        const newLayer = new Grid<T2>(this.size);
        this.traverse((oldValue, position) => {
            const newValue = converter(oldValue, position, this);
            newLayer.setAt(position, newValue);
        });
        return newLayer;
    }

    public subGrid(box: Box2) {
        const size = box.max.clone().sub(box.min);
        if (size.width < 0 || size.height < 0) {
            throw new Error(`Invalid sub-grid size: ${size.width}, ${size.height}.`);
        }

        const sub = new Grid<T>(size).fill(pos => this.at(pos.clone().add(box.min)));
        return sub;
    }

    *[Symbol.iterator]() {
        for (const item of this._elements) {
            yield item;
        }
    }
    
    public static from<T>(arrays: T[][]): Grid<T> {
        const grid = new Grid<T>(this.getSize(arrays)).fill(v => arrays[v.y]?.[v.x]);
        return grid;
    }

    public static getSize<T>(arrays: T[][]): Vector2 {
        const size = arrays.length > 0
            ? new Vector2(arrays[0].length, arrays.length)
            : new Vector2();
        return size;
    }
}