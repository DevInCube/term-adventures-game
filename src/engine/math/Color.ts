import { hslToRgb, rgbToHsl } from "../../utils/color";
import { clamp } from "../../utils/math";

export class Color {
    public r = 1;
    public g = 1;
    public b = 1;
    public a = 1;

    constructor(
        r: number | string | Color,
        g?: number,
        b?: number,
        a: number | undefined = 1,
    ) {
        if (typeof r === "number" && typeof g === "number" && typeof b === "number" && typeof a === "number") {
            this.setRGBA(r, g, b, a);
        } else if (typeof r === "number") {
            this.setHex(r);
        } else if (typeof r === "string") {
            const [rValue, gValue, bValue, aValue] = Color._hexStringToRGBA(r);
            this.setRGBA(rValue, gValue, bValue, aValue);
        } else if (r instanceof Color) {
            this.copy(r);
        }
    }

    public copy(c: Color) {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
    }

    public equals(c: Color): boolean {
		return (
            c.r === this.r && 
            c.g === this.g &&
            c.b === this.b &&
            c.a === this.a
        );
	}

    public setRGBA(r: number, g: number, b: number, a: number) {
        if (r > 1 || g > 1 || b > 1 || a > 1) {
            throw new Error(`Invalid color component: (${r},${g},${b},${a}).`);
        }

        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public setHex(hex: number) {
        hex = Math.floor(hex);

        this.r = (hex >> 24 & 255) / 255;
        this.g = (hex >> 16 & 255) / 255;
        this.b = (hex >> 8 & 255) / 255;
        this.a = (hex & 255) / 255;
    }

    public getHex() {
        return (
            Math.round(clamp(this.r * 255, 0, 255)) * 256 * 256 * 256 +
            Math.round(clamp(this.g * 255, 0, 255)) * 256 * 256 +
            Math.round(clamp(this.b * 255, 0, 255)) * 256 +
            Math.round(clamp(this.a * 255, 0, 255))
        );
    }

    public getHexString() {
        return `#${this.getHex().toString(16)}`;
    }

    public getLightness() {
        const [_, __, l, ___] = rgbToHsl(this.r, this.g, this.b, this.a);
        return l;
    }
    
    public setLightness(lightness: number) {
        const [h, s, _, a1] = rgbToHsl(this.r, this.g, this.b, this.a);
        const [r, g, b, a2] = hslToRgb(h, s, lightness, a1);
        this.setRGBA(r, g, b, a2);
    }

    public setAlpha(alpha: number) {
        this.a = alpha;
        return this;
    }

    public to(): [number, number, number, number] {
        return [this.r, this.g, this.b, this.a];
    }

    public getStyle(): string {
        return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
    }

    *[Symbol.iterator]() {
		yield this.r;
		yield this.g;
		yield this.b;
		yield this.a;
	}

    public static from(array: number[], offset = 0) {
        return new Color(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
    }

    public static fromRGBA(r: number, g: number, b: number, a: number) {
        return new Color(r, g, b, a);
    }

    public static fromHexString(hex: string) {
        const [r, g, b, a] = this._hexStringToRGBA(hex);
        return new Color(r, g, b, a);
    }

    private static _hexStringToRGBA(hex: string) {
        if (!hex.startsWith("#")) {
            throw new Error(`Invalid hex string: ${hex}.`);
        }

        hex = hex.replace(/^#/, "").toLowerCase();

        if (![3, 4, 6, 8].includes(hex.length)) {
            throw new Error("Invalid hex color length");
        }

        // Expand 3 or 4 digits to 6 or 8 digits.
        if (hex.length === 3 || hex.length === 4) {
            hex = hex.split("").map(ch => ch + ch).join("");
        }

        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

        return [r, g, b, a];
    }
}