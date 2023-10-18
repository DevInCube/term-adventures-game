import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { StaticGameObject } from "../../engine/StaticGameObject";

export const bamboo = new StaticGameObject([0, 4],
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
 
 
 
 
.`, ``), [0, 0]);