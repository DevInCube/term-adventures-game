import { ObjectSkin } from "./ObjectSkin";

class SpriteInfo {
    width: number;
    height: number;
    name: string;
    empty: string;
}

export class Sprite {
    frames: { [key: string]: ObjectSkin[] } = {};

    static parse(str: string): Sprite {
        const info = new SpriteInfo();
        const lines = str.split(`\n`);
        let i = 0;
        const colorsDict: {[key: string]: (string | undefined)[]} = {};
        // read headers (sprite info)
        while (lines[i] !== '') {
            const [key, value] = lines[i].split(':');
            if (key === 'width') info.width = Number(value);
            else if (key === 'height') info.height = Number(value);
            else if (key === 'name') info.name = value;
            else if (key === 'empty') info.empty = value;
            else if (key === 'color') {
                const colorParts = value.split(',');
                colorsDict[colorParts[0]] = [colorParts[1], colorParts[2]];
            }
            else throw new Error(`unknown key: '${key}'`);
            i++;
        }
        i++;
        //console.log(info);
        const sprite = new Sprite();
        while (i < lines.length) {
            if (lines[i].startsWith(info.name)) {
                const name = lines[i].substr(info.name.length);
                //console.log(name);
                i++;
                const framesCount = lines[i].length / info.width;
                const bodies = Array(framesCount).fill(``);
                for (let y = 0; y < info.height; y++) {
                    for (let x = 0; x < framesCount; x++) {
                        const part = lines[i + y].substr(x * info.width, info.width);
                        bodies[x] += `${part}\n`.replace(new RegExp(`${info.empty}`, 'g'), ' '); 
                    }
                }
                i += info.height;
                //
                const colors = Array(framesCount).fill(``);
                for (let y = 0; y < info.height; y++) {
                    for (let x = 0; x < framesCount; x++) {
                        const part = lines[i + y].substr(x * info.width, info.width);
                        colors[x] += `${part}\n`.replace(new RegExp(`${info.empty}`, 'g'), ' '); 
                    }
                }
                i += info.height;
                for (let k = 0; k < framesCount; k++) {
                    if (k === 0) sprite.frames[name] = [];
                    sprite.frames[name].push(new ObjectSkin(bodies[k], colors[k], colorsDict));
                }
            }
            else {
                i += 1;
            }
        }
        return sprite;
    }
}