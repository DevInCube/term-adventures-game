import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/data/Vector2";


export function house(options: { position: [number, number]; }) {
    return new StaticGameObject(new Vector2(2, 2),
        new ObjectSkin(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
            B: [undefined, 'black'],
            S: [undefined, '#004'],
            W: ["black", "darkred"],
            D: ["black", "saddlebrown"]
        }),
        new ObjectPhysics(`
 ... 
 . .`, ''), Vector2.from(options.position));
}


const windowHorizontalSkin = () => new ObjectSkin(`🪟`, '.', { '.': ['blue', 'transparent'] });
const wallSkin = () => new ObjectSkin(` `, '.', { '.': ['transparent', '#666'] });
const physicsUnitBlockedTransparent = (transparency?: string) => new ObjectPhysics('.', '', '', '', transparency || '0');
const physicsUnitBlocked = () => new ObjectPhysics('.');
export const windowHorizontal = (options: { position: [number, number], transparency?: string}) => 
    new StaticGameObject(Vector2.zero, windowHorizontalSkin(), physicsUnitBlockedTransparent(options.transparency), Vector2.from(options.position));
export const wall = (options: { position: [number, number] }) => new StaticGameObject(Vector2.zero, wallSkin(), physicsUnitBlocked(), Vector2.from(options.position));
