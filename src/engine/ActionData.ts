import { GameObjectAction, ObjectAction, ObjectActionType, Object2D } from "./objects/Object2D";
import { Cell } from "./graphics/Cell";
import { Npc } from "./objects/Npc";
import { Item } from "./objects/Item";
import { Vector2 } from "./math/Vector2";

const _position = new Vector2();

export type ActionData = {
    type: ObjectActionType;
    object: Object2D;
    action: GameObjectAction;
    actionIcon: Cell[];
};

export function convertToActionData(object: Object2D, objectAction: ObjectAction): ActionData {
    const iconPos = objectAction.iconPosition;
    const actionIcon = object.skin.getCellsAt(iconPos);
    return { type: objectAction.type, object, action: objectAction.callback, actionIcon }; 
}

export function getNpcInteraction(npc: Npc): ActionData | undefined {
    if (!npc.scene) {
        return;
    }

    return npc.scene.getActionsAt(npc.getWorldCursorPosition(_position)).filter(x => x.type === "interaction")[0];
}

export function getNpcCollisionAction(npc: Npc): ActionData | undefined {
    if (!npc.scene) {
        return;
    }

    return npc.scene.getActionsAt(npc.getWorldPosition(_position)).filter(x => x.type === "collision")[0];
}

export function getItemUsageAction(item: Item): ActionData | undefined {
    const interactions = item.actions.filter(x => x.type === "usage");
    if (interactions.length === 0) {
        return undefined;
    }

    // This is a default usage action.
    const defaultAction = interactions[0];
    return convertToActionData(item, defaultAction);
}
