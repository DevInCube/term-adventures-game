import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";


export function house(options: { position: [number, number]; }) {
    return new StaticGameObject([2, 2],
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
 . .`, ''), options.position);
}


const windowHorizontalSkin = () => new ObjectSkin(`🪟`, '.', { '.': ['blue', 'transparent'] });
const wallSkin = () => new ObjectSkin(` `, '.', { '.': ['transparent', '#666'] });
const physicsUnitBlockedTransparent = (transparency?: string) => new ObjectPhysics('.', '', '', '', transparency || '0');
const physicsUnitBlocked = () => new ObjectPhysics('.');
export const windowHorizontal = (options: { position: [number, number], transparency?: string}) => 
    new StaticGameObject([0, 0], windowHorizontalSkin(), physicsUnitBlockedTransparent(options.transparency), options.position);
export const wall = (options: { position: [number, number] }) => new StaticGameObject([0, 0], wallSkin(), physicsUnitBlocked(), options.position);
