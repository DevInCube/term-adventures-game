import { Box3 } from "./Box3";
import { Grid } from "./Grid";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";

export type Grid3Iterator<T> = (value: T, position: Vector3, grid: Grid3<T>) => void;
export type Grid3ValueFactory<T> = (position: Vector3, grid: Grid3<T>) => T;
export type Grid3ValueConverter<T, T2> = (value: T, position: Vector3, grid: Grid3<T>) => T2;

export class Grid3<T> {
    private _elements: T[] = [];

    get width() {
        return this.size.width;
    }

    get height() {
        return this.size.height;
    }

    get depth() {
        return this.size.depth;
    }

    constructor(
        public readonly size: Vector3,
    ) {
    }

    public atDepth(depth: number): Grid<T> {
        if (depth < 0 || depth >= this.size.depth) {
            throw new Error(`Invalid depth: ${depth}.`);
        }

        const size = new Vector2(this.size.width, this.size.height);
        const sub = new Grid<T>(size).fill(pos => this.at(new Vector3(pos.x, pos.y, depth)));
        return sub;
    }
    
    public at(position: Vector3): T {
        if (position.z < 0 || position.z >= this.size.depth) {
            return <T>undefined;
        }

        if (position.y < 0 || position.y >= this.size.height) {
            return <T>undefined;
        }

        if (position.x < 0 || position.x >= this.size.width) {
            return <T>undefined;
        }

        return this._elements[this._getIndex(position)];
    }

    public setAt(position: Vector3, value: T): void {
        if (position.z < 0 || position.z >= this.size.depth) {
            return;
        }

        if (position.y < 0 || position.y >= this.size.height) {
            return;
        }

        if (position.x < 0 || position.x >= this.size.width) {
            return;
        }

        this._elements[this._getIndex(position)] = value;
    }
    
    public containsPosition([x, y, z]: Vector3): boolean {
        return (
            x >= 0 && 
            x < this.size.width && 
            y >= 0 &&
            y < this.size.height &&
            z >= 0 &&
            z < this.size.depth
        );
    }

    public traverse(iteration: Grid3Iterator<T>): void {
        const position = new Vector3();
        for (position.z = 0; position.z < this.depth; position.z++) {
            for (position.y = 0; position.y < this.height; position.y++) {
                for (position.x = 0; position.x < this.width; position.x++) {
                    const value = this.at(position);
                    iteration(value, position, this);
                }
            }
        }
    }

    public fillValue(value: T) {
        this.traverse((_, pos) => this.setAt(pos, value));
        return this;
    }

    public fill(factory: Grid3ValueFactory<T>) {
        this.traverse((_, position) => {
            const newValue = factory(position, this);
            this.setAt(position, newValue);
        });
        return this;
    }

    public map<T2>(converter: Grid3ValueConverter<T, T2>): Grid3<T2> {
        const newLayer = new Grid3<T2>(this.size);
        this.traverse((oldValue, position) => {
            const newValue = converter(oldValue, position, this);
            newLayer.setAt(position, newValue);
        });
        return newLayer;
    }

    public subGrid(box: Box3): Grid3<T> {
        const size = box.max.clone().sub(box.min);
        if (size.width < 0 || size.height < 0 || size.depth < 0) {
            throw new Error(`Invalid sub-grid size: ${size.width}, ${size.height}, ${size.depth}.`);
        }

        const sub = new Grid3<T>(size).fill(pos => this.at(pos.clone().add(box.min)));
        return sub;
    }

    *[Symbol.iterator]() {
        for (const item of this._elements) {
            yield item;
        }
    }
    
    public static from<T>(arrays: T[][][]): Grid3<T> {
        const grid = new Grid3<T>(this.getSize(arrays)).fill(v => arrays[v.z]?.[v.y]?.[v.x]);
        return grid;
    }

    public static getSize<T>(arrays: T[][][]): Vector3 {
        const size = arrays.length > 0 && arrays[0].length > 0 && arrays[0][0].length > 0
            ? new Vector3(arrays[0][0].length, arrays[0].length, arrays.length)
            : new Vector3();
        return size;
    }

    private _getIndex(position: Vector3): number {
        const index =
            position.z * this.size.width * this.size.height +
            position.y * this.size.width +
            position.x;
        return index;
    }
}