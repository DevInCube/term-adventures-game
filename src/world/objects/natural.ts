import { StaticGameObject } from "../../engine/StaticGameObject";
import { ObjectSkin } from "../../engine/ObjectSkin";
import { ObjectPhysics } from "../../engine/ObjectPhysics";
import { GameEvent } from "../../engine/GameEvent";
import { Scene } from "../../engine/Scene";
import { SakuraTree } from "./SakuraTree";

const createUnitSkin = (sym: string, color: string = 'black') => new ObjectSkin(sym, `u`, {
    u: [color, 'transparent'],
});
const unitPhysics = new ObjectPhysics(` `);
const createUnitStaticObject = (sym: string, color: string = 'black') => new StaticGameObject([0, 0],
    createUnitSkin(sym, color),
    unitPhysics,
    [0, 0])

export const flower = createUnitStaticObject(`❁`, 'red');
export const wheat = createUnitStaticObject(`♈`, 'yellow');
export const hotspring = new StaticGameObject([0, 0],
    createUnitSkin(`♨`, 'lightblue'),
    new ObjectPhysics(' ', ' ', 'A'),
    [0, 0])
export const duck = createUnitStaticObject(`🦆`, 'white');