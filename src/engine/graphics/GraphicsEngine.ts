import { SceneObject } from "../objects/SceneObject";
import { Cell } from "./Cell";
import { Npc } from "../objects/Npc";
import { ObjectSkin } from "../components/ObjectSkin";
import { Camera } from "../Camera";
import { CellInfo } from "./CellInfo";
import { CanvasContext } from "./CanvasContext";

export class GraphicsEngine {
    
}

export const cellStyle = {
    borderColor: "#1114",
    borderWidth: 1,
    default: {
        textColor: '#fff',
        backgroundColor: '#335'
    },
    size: {
        width: 32,
        height: 32,
    },
    charSize: 26,
};

export function drawObjects(ctx: CanvasContext, camera: Camera, objects: SceneObject[]) {
    const importantObjects = objects.filter(x => x.important);
    for (const object of objects) {
        if (!object.enabled) continue;

        drawObject(ctx, camera, object, importantObjects);
        // reset object highlight.
        object.highlighted = false;
    }

    // draw cursors
    for (const object of objects) {
        if (!object.enabled) continue;

        if (object instanceof Npc && 
            (object.direction[0] || object.direction[1]) ) {
            if (object.objectInMainHand) {
                object.objectInMainHand.highlighted = object.showCursor;
                object.objectInMainHand.highlighColor = 'yellow';
                drawObject(ctx, camera, object.objectInMainHand, []);
            }
            if (object.objectInSecondaryHand) {
                drawObject(ctx, camera, object.objectInSecondaryHand, []);
            }
        }
    }
}

export function drawObjectAt(ctx: CanvasContext, camera: Camera | undefined, obj: SceneObject, position: [number ,number]) {
    for (let y = 0; y < obj.skin.grid.length; y++) {
        for (let x = 0; x < obj.skin.grid[y].length; x++) {
            const cell = getCellAt(obj.skin, x, y);
            const left = position[0] - obj.originPoint[0] + x;
            const top = position[1] - obj.originPoint[1] + y;
            drawCell(ctx, camera, cell, left, top);
        }
    }
}

function drawObject(ctx: CanvasContext, camera: Camera, obj: SceneObject, importantObjects: SceneObject[]) {
    let showOnlyCollisions: boolean = isInFrontOfImportantObject();
    
    for (let y = 0; y < obj.skin.grid.length; y++) { 
        for (let x = 0; x < obj.skin.grid[y].length; x++) {
            const cell = getCellAt(obj.skin, x, y);
            if (cell.isEmpty) continue;

            const transparent = (showOnlyCollisions && !isCollision(obj, x, y));
            const cellBorders = getCellBorders(obj, x, y)
            const left = obj.position[0] - obj.originPoint[0] + x;
            const top = obj.position[1] - obj.originPoint[1] + y;
            drawCell(ctx, camera, cell, left - camera.position.left, top - camera.position.top, transparent, cellBorders);
        }
    }

    function isInFrontOfImportantObject() {
        for (const o of importantObjects) {
            if (isPositionBehindTheObject(obj, o.position[0], o.position[1])) {
                return true;
            }
        }
        return false;
    }

    function isEmptyCell(object: SceneObject, left: number, top: number) {
        if (left < 0 || top < 0) return true;
        const grid = object.skin.grid;
        if (top >= grid.length || left >= grid[top].length) return true;
        const char = grid[top][left];
        return char === ' ';
    }

    function getCellBorders(obj: SceneObject, x: number, y: number) {
        return obj.highlighted 
            ? [
                isEmptyCell(obj, x + 0, y - 1) ? obj.highlighColor : null,  // top
                isEmptyCell(obj, x + 1, y + 0) ? obj.highlighColor : null,
                isEmptyCell(obj, x + 0, y + 1) ? obj.highlighColor : null,
                isEmptyCell(obj, x - 1, y + 0) ? obj.highlighColor : null,
            ]
            : [];
    }
}

function getCellAt(skin: ObjectSkin, x: number, y:number): Cell {
    const cellColor = (skin.raw_colors[y] && skin.raw_colors[y][x]) || ['', ''];
    const char = skin.grid[y][x];
    const cell = new Cell(char, cellColor[0], cellColor[1]);
    return cell;
}

const emptyCollisionChar = ' ';

export function isCollision(object: SceneObject, left: number, top: number) {
    const cchar = (object.physics.collisions[top] && object.physics.collisions[top][left]) || emptyCollisionChar;
    return cchar !== emptyCollisionChar;
}

export function isPositionBehindTheObject(object: SceneObject, left: number, top: number): boolean {
    const pleft = left - object.position[0] + object.originPoint[0];
    const ptop = top - object.position[1] + object.originPoint[1];
    // check collisions
    if (isCollision(object, ptop, pleft)) return false;
    // check characters skin
    const cchar = (object.skin.grid[ptop] && object.skin.grid[ptop][pleft]) || emptyCollisionChar;
    // check color skin
    const color = (object.skin.raw_colors[ptop] && object.skin.raw_colors[ptop][pleft]) || [undefined, undefined];
    return cchar !== emptyCollisionChar || !!color[0] || !!color[1];
}


export function drawCell(
    ctx: CanvasContext,
    camera: Camera | undefined,
    cell: Cell, 
    leftPos: number, 
    topPos: number, 
    transparent: boolean = false,
    border: (string | null)[] = [null, null, null, null]) { 

    if (cell.isEmpty) return;
    if (camera) {
        if (leftPos < 0 || 
            topPos < 0 || 
            leftPos >= camera.size.width ||
            topPos >= camera.size.height) {
            return;
        }
    }
    ctx.add([topPos, leftPos], <CellInfo>{ cell, transparent, border });
}