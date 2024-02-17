import { groupUnicode } from "../../utils/unicode";
import { ObjectSkin } from "../components/ObjectSkin";
import { ObjectSkinBuilder } from "./ObjectSkinBuilder";
import { SpriteInfo } from "./SpriteInfo";

export class Sprite {
    frames: { [key: string]: ObjectSkin[] } = {};

    static parseSimple(str: string): Sprite {
        const sprite = new Sprite();
        const groups = groupUnicode(str);
        // TODO: grouping is wrong for invertor.
        //console.log(groups);
        for (const [index, char] of groups.entries()) {
            const name = index.toString();
            const skin = new ObjectSkin().char(char);
            sprite.frames[name] = [skin];
        }

        return sprite;
    }

    // TODO: group unicode characters in frames.
    static parse(str: string): Sprite {
        const info = new SpriteInfo();
        const lines = str.split(`\n`);
        let i = 0;
        const colorsDict: {[key: string]: [string | undefined, string | undefined]} = {};
        // read headers (sprite info)
        while (lines[i] !== '') {
            const [key, value] = lines[i].split(':');
            if (key === 'width') info.size.x = Number(value);
            else if (key === 'height') info.size.y = Number(value);
            else if (key === 'name') info.name = value;
            else if (key === 'empty') info.empty = value;
            else if (key === 'color') {
                const colorParts = value.split(',');
                colorsDict[colorParts[0]] = [colorParts[1], colorParts[2]];
            } else throw new Error(`unknown key: '${key}'`);

            i += 1;
        }

        i++;
        //console.log(info);
        const sprite = new Sprite();
        while (i < lines.length) {
            if (!lines[i].startsWith(info.name)) {
                i += 1;
                continue;
            }

            const name = lines[i].substr(info.name.length);
            //console.log(name);
            i += 1;
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
                if (k === 0) {
                    sprite.frames[name] = [];
                }

                const skin = new ObjectSkinBuilder(bodies[k], colors[k], colorsDict)
                    .build();
                sprite.frames[name].push(skin);
            }
        }

        return sprite;
    }
}