import { ObjectSkin } from "../engine/components/ObjectSkin";
import { emitEvent } from "../engine/events/EventLoop";
import { GameEvent } from "../engine/events/GameEvent";
import { Npc } from "../engine/objects/Npc";

const ulan = new Npc(new ObjectSkin('🐻', `.`, {
    '.': [undefined, 'transparent'],
}), [4, 4]);
ulan.setAction(0, 0, (o) => {
    emitEvent(new GameEvent(o, "user_action", {
        subtype: "npc_talk",
        object: o,
    }));
});

export const npcs = [
    ulan,
];