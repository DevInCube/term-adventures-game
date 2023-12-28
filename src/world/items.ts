import { Item } from "../engine/objects/Item";
import { ObjectSkin } from "../engine/components/ObjectSkin";
import { ObjectPhysics } from "../engine/components/ObjectPhysics";
import { MountBehavior } from "./behaviors/MountBehavior";

export const lamp = () => Item.create(
    "lamp",
    new ObjectSkin(`🏮`),
    new ObjectPhysics(` `, `f`, `a`)
);

export const sword = () => Item.create("sword", new ObjectSkin(`🗡`));

export const emptyHand = () => Item.create("empty_hand", new ObjectSkin(` `));

export const bambooSeed = () => Item.create(
    "bamboo_seed",
    new ObjectSkin(`▄`, `T`, {'T': ['#99bc20', 'transparent']})
);

// TODO: reveals invisible underwater chests.
export const seaShell = () => Item.create("sea_shell", new ObjectSkin(`🐚`));

export class Saddle extends Item {
    constructor() {
        super([0, 0],
            new ObjectSkin(`🐾`, `T`, {'T': ['#99bc20', 'transparent']}));

        this.type = "saddle";
        this.setAction(0, 0, ctx => {
            // TODO: resolve this by event.
            if (ctx.initiator.mount) {
                const mountBeh = ctx.initiator.mount.behaviors.find(x => x instanceof MountBehavior) as MountBehavior;
                if (mountBeh) {
                    mountBeh.unmount();
                }
            }
        });
    }
}

export const saddle = () => new Saddle();
