import { ObjectSkin } from "../engine/components/ObjectSkin";
import { StaticGameObject } from "../engine/objects/StaticGameObject";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";

export function distanceTo(a: [number, number], b: [number, number]): number {
    return Math.sqrt(
        (a[0] - b[0]) ** 2 + 
        (a[1] - b[1]) ** 2);
}

export function createTextObject(text: string, x: number, y: number) {
    const colors = new ObjectSkin(
        text,
        ''.padEnd(text.length, '.'), 
        {'.': [undefined, undefined]});
    const t = new StaticGameObject([0, 0], colors, new ObjectPhysics(), [x, y]);
    t.type = "victory_text_object";
    return t;
}

export function deepCopy(obj: any): any {
    let copy:{[key: string]: any};

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}