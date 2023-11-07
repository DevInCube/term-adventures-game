import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";

const createUnitSkin = (sym: string, color: string = 'black') => new ObjectSkin(sym, `u`, {
    u: [color, 'transparent'],
});
const createUnitPhysics = () => new ObjectPhysics(` `);
const createUnitStaticObject = (options: { position: [number, number], sym: string, color: string }) => new StaticGameObject(
    [0, 0],
    createUnitSkin(options.sym, options.color),
    createUnitPhysics(),
    options.position)

export const flower = (options: { position: [number, number] }) => createUnitStaticObject({ ...options, sym: `❁`, color: 'red' });

export const wheat = (options: { position: [number, number] }) => createUnitStaticObject({ ...options, sym: `♈`, color: 'yellow' });

export const hotspring = (options: { position: [number, number] }) => new StaticGameObject(
    [0, 0],
    createUnitSkin(`♨`, 'lightblue'),
    new ObjectPhysics(' ', ' ', 'A'),
    options.position);