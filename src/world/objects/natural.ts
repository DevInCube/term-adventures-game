import { Object2D } from "../../engine/objects/Object2D";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";
import { Vector2 } from "../../engine/math/Vector2";
import { Color } from "../../engine/math/Color";
import { Colors } from "../../engine/math/Colors";

const createUnitSkin = (sym: string, color: Color = Colors.Black) =>
    new ObjectSkin().char(sym).color(color);
const createUnitStaticObject = (options: { position: [number, number], sym: string, color: Color }) => new Object2D(
    Vector2.zero,
    createUnitSkin(options.sym, options.color),
    new ObjectPhysics(),
    Vector2.from(options.position))

export const flower = (options: { position: [number, number] }) =>
    createUnitStaticObject({ ...options, sym: `❁`, color: Colors.Red });

export const bush = (options: { position: [number, number] }) =>
    new Object2D(
        Vector2.zero,
        createUnitSkin(`🌳`, Colors.Green),
        new ObjectPhysics().material(0.8),
        Vector2.from(options.position));

export const wheat = (options: { position: [number, number] }) =>
    createUnitStaticObject({ ...options, sym: `⸙`, color: Colors.Yellow }); // 🌾

export const hotspring = (options: { position: [number, number] }) => new Object2D(
    Vector2.zero,
    createUnitSkin(`♨`, Colors.LightBlue),
    new ObjectPhysics().temperature('A'),
    Vector2.from(options.position));
