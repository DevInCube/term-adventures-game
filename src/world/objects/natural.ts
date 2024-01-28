import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectSkinBuilder } from "../../engine/components/ObjectSkinBuilder";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";

const createUnitSkin = (sym: string, color: string = 'black') => new ObjectSkinBuilder(sym, `u`, {
    u: [color, 'transparent'],
}).build();
const createUnitPhysics = () => new ObjectPhysics(` `);
const createUnitStaticObject = (options: { position: [number, number], sym: string, color: string }) => new Object2D(
    Vector2.zero,
    createUnitSkin(options.sym, options.color),
    createUnitPhysics(),
    Vector2.from(options.position))

export const flower = (options: { position: [number, number] }) => createUnitStaticObject({ ...options, sym: `❁`, color: 'red' });

export const wheat = (options: { position: [number, number] }) => createUnitStaticObject({ ...options, sym: `♈`, color: 'yellow' });

export const hotspring = (options: { position: [number, number] }) => new Object2D(
    Vector2.zero,
    createUnitSkin(`♨`, 'lightblue'),
    new ObjectPhysics(' ', ' ', 'A'),
    Vector2.from(options.position));