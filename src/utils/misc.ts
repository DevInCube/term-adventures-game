import { ObjectSkin } from "../engine/components/ObjectSkin";
import { Object2D } from "../engine/objects/Object2D";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { Vector2 } from "../engine/math/Vector2";

export function createTextObjectSkin(text: string, color?: string, background?: string) {
    const textSkin = new ObjectSkin(
        text,
        ''.padEnd(text.length, '.'), 
        {'.': [color, background]});
    return textSkin;
} 

export function createTextObject(text: string, pos: Vector2) {
    const skin = createTextObjectSkin(text);
    const t = new Object2D(Vector2.zero, skin, new ObjectPhysics(), pos);
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