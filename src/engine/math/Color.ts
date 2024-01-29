import { clamp } from "../../utils/math";

export class Color {
    public r = 1;
    public g = 1;
    public b = 1;

    constructor(
        r: number | string,
        g?: number,
        b?: number
    ) {
        if (typeof r === "number" && typeof g === "number" && typeof b === "number") {
            this.setRGB(r, g, b);
        } else if (typeof r === "number") {
            this.setHex(r);
        } else if (typeof r === "string") {
            this.setStyle(r);
        }
    }

    public equals(c: Color): boolean {
		return (
            c.r === this.r && 
            c.g === this.g &&
            c.b === this.b
        );
	}

    public setRGB(r: number, g: number, b: number) {
        if (r > 1 || g > 1 || b > 1) {
            throw new Error(`Invalid color component: (${r},${g},${b}).`);
        }

        this.r = r;
        this.g = g;
        this.b = b;
    }

    public setHex(hex: number) {
        hex = Math.floor(hex);

		this.r = (hex >> 16 & 255) / 255;
		this.g = (hex >> 8 & 255) / 255;
		this.b = (hex & 255) / 255;
    }

    public setStyle(style: string) {
        throw new Error("Not implemented.");
    }

    public getHex() {
        return (
            Math.round(clamp(this.r * 255, 0, 255)) * 65536 +
            Math.round(clamp(this.g * 255, 0, 255)) * 256 +
            Math.round(clamp(this.b * 255, 0, 255))
        );
    }

    public to(): [number, number, number] {
        return [this.r, this.g, this.b];
    }

    public getStyle(): string {
        return `rgb(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)})`;
    }

    *[Symbol.iterator]() {
		yield this.r;
		yield this.g;
		yield this.b;
	}

    public static from(array: number[], offset = 0) {
        return new Color(array[offset], array[offset + 1], array[offset + 2]);
    }
}