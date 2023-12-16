import { Item } from "../engine/objects/Item";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";

export const lamp = () => new Item([0, 0], 
    new ObjectSkin(`🏮`, `.`, {'.': [undefined, 'transparent']}),
    new ObjectPhysics(` `, `f`, `a`),
    [0, 0]
);

export const sword = () => new Item([0, 0], 
    new ObjectSkin(`🗡`, `.`, {'.': [undefined, 'transparent']}),
    new ObjectPhysics(),
    [0, 0]
);

export const emptyHand = () => new Item([0, 0], 
    new ObjectSkin(` `, `.`, {'.': [undefined, 'transparent']}),
    new ObjectPhysics(),
    [0, 0]
);

export const bambooSeed = () => new Item([0, 0],
    new ObjectSkin(`▄`, `T`, {'T': ['#99bc20', 'transparent']}),
    new ObjectPhysics(),
    [0, 0]
);