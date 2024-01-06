import { GameObjectAction, ObjectAction, ObjectActionType, SceneObject } from "./objects/SceneObject";
import { Cell } from "./graphics/Cell";
import { Npc } from "./objects/Npc";
import { Item } from "./objects/Item";

export type ActionData = {
    type: ObjectActionType;
    object: SceneObject;
    action: GameObjectAction;
    actionIcon: Cell;
};

export function convertToActionData(object: SceneObject, objectAction: ObjectAction): ActionData {
    const [ileft, itop] = objectAction.iconPosition;
    const actionIconChar = object.skin.grid[itop][ileft];
    const [fgColor, bgColor] = object.skin.raw_colors[itop] ? (object.skin.raw_colors[itop][ileft] || []) : [];
    const actionIcon = new Cell(actionIconChar, fgColor, bgColor);
    return { type: objectAction.type, object, action: objectAction.callback, actionIcon }; 
}

export function getNpcInteraction(npc: Npc): ActionData | undefined {
    if (!npc.scene) {
        return;
    }

    return npc.scene.getActionsAt(npc.cursorPosition).filter(x => x.type === "interaction")[0];
}

export function getNpcCollisionAction(npc: Npc): ActionData | undefined {
    if (!npc.scene) {
        return;
    }

    return npc.scene.getActionsAt(npc.position).filter(x => x.type === "collision")[0];
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
