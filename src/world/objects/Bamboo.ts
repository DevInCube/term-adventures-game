import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { StaticGameObject } from "../../engine/objects/StaticGameObject";

export function bamboo(options: { position: [number, number] }) {
    return new StaticGameObject([0, 4],
    new ObjectSkin(`▄
█
█
█
█
█`, `T
H
L
H
L
D`, {
        // https://colorpalettes.net/color-palette-412/
        'T': ['#99bc20', 'transparent'],
        'L': ['#517201', 'transparent'],
        'H': ['#394902', 'transparent'],
        'D': ['#574512', 'transparent'],
    }), new ObjectPhysics(` 
 
 
 
 
.`, ``), options.position);
}