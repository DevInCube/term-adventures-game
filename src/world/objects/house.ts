import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";


export function house(options: { position: [number, number]; }) {
    return new Object2D(new Vector2(2, 2),
        new ObjectSkinBuilder(` /^\\ 
==*==
 ▓ ▓ `, ` BBB
BBSBB
 WDW`, {
            B: [undefined, 'black'],
            S: [undefined, '#004'],
            W: ["black", "darkred"],
            D: ["black", "saddlebrown"]
        }).build(),
        new ObjectPhysics(`
 ... 
 . .`, ''), Vector2.from(options.position));
}


const windowHorizontalSkin = () => new ObjectSkinBuilder(`🪟`, '.', { '.': ['blue', 'transparent'] }).build();
const wallSkin = () => new ObjectSkinBuilder(` `, '.', { '.': ['transparent', '#666'] }).build();
const physicsUnitBlockedTransparent = (transparency?: string) => new ObjectPhysics('.', '', '', '', transparency || '0');
const physicsUnitBlocked = () => new ObjectPhysics('.');
export const windowHorizontal = (options: { position: [number, number], transparency?: string}) => 
    new Object2D(Vector2.zero, windowHorizontalSkin(), physicsUnitBlockedTransparent(options.transparency), Vector2.from(options.position));
export const wall = (options: { position: [number, number] }) => new Object2D(Vector2.zero, wallSkin(), physicsUnitBlocked(), Vector2.from(options.position));
