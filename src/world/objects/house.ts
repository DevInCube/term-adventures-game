import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/data/ObjectSkinBuilder";
import { ObjectPhysicsBuilder } from "../../engine/data/ObjectPhysicsBuilder";
import { Vector2 } from "../../engine/math/Vector2";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Colors } from "../../engine/math/Colors";
import { Color } from "../../engine/math/Color";

export function house(options: { position: [number, number]; }) {
    const object = new Object2D(new Vector2(2, 2),
        new ObjectSkinBuilder(`
 /^\\ 
==*==
 ▓ ▓ 
`, `
 BBB 
BBSBB
 WDW
`, {
            B: [undefined, Colors.Black],
            S: [undefined, Color.fromHexString('#004')],
            W: [Colors.Black, Colors.DarkRed],
            D: [Colors.Black, Colors.SaddleBrown]
        }).build(),
        new ObjectPhysicsBuilder(`
     
 ... 
 . . 
`).build(), Vector2.from(options.position));
    object.type = "big_house";
    return object;
}


const windowHorizontalSkin = () => new ObjectSkin().char(`🪟`).color(Colors.Blue);
const wallSkin = () => new ObjectSkin().background(Colors.Gray);
const physicsUnitBlockedTransparent = (transparency?: string) => new ObjectPhysics().material(transparency || '0');
const physicsUnitBlocked = () => new ObjectPhysics().collision();
export const windowHorizontal = (options: { position: [number, number], transparency?: string}) => 
    new Object2D(Vector2.zero, windowHorizontalSkin(), physicsUnitBlockedTransparent(options.transparency), Vector2.from(options.position));
export const wall = (options: { position: [number, number] }) => new Object2D(Vector2.zero, wallSkin(), physicsUnitBlocked(), Vector2.from(options.position));
