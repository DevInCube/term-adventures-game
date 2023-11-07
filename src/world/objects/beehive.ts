import { StaticGameObject } from "../../engine/objects/StaticGameObject";
import { ObjectSkin } from "../../engine/components/ObjectSkin";
import { ObjectPhysics } from "../../engine/components/ObjectPhysics";


export function beehive(options: { position: [number, number]; }) {
    return new StaticGameObject([0, 0],
        new ObjectSkin(`☷`, `R`, {
            'R': ['black', 'orange'],
        }),
        new ObjectPhysics(`.`),
        options.position);
}
