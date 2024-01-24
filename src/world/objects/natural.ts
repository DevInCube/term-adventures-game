import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/data/Vector2";

const createUnitSkin = (sym: string, color: string = 'black') => new ObjectSkin(sym, `u`, {
    u: [color, 'transparent'],
});
const createUnitPhysics = () => new ObjectPhysics(` `);
const createUnitStaticObject = (options: { position: [number, number], sym: string, color: string }) => new StaticGameObject(
    Vector2.zero,
    createUnitSkin(options.sym, options.color),
    createUnitPhysics(),
    Vector2.from(options.position))

export const flower = (options: { position: [number, number] }) => createUnitStaticObject({ ...options, sym: `❁`, color: 'red' });

export const wheat = (options: { position: [number, number] }) => createUnitStaticObject({ ...options, sym: `♈`, color: 'yellow' });

export const hotspring = (options: { position: [number, number] }) => new StaticGameObject(
    Vector2.zero,
    createUnitSkin(`♨`, 'lightblue'),
    new ObjectPhysics(' ', ' ', 'A'),
    Vector2.from(options.position));