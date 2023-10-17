import { SceneObject } from "./SceneObject";
import { Cell } from "./Cell";
import { Npc } from "./Npc";
import { leftPad, topPad } from "../main";
import { ObjectSkin } from "./ObjectSkin";
import { Camera } from "./Camera";

export class GraphicsEngine {
    
}

export interface CellInfo {
    cell: Cell;
    transparent: boolean;
    border: [(string | null), (string | null), (string | null), (string | null)];
}

export class CanvasContext {
    previous: CellInfo[][][] = [];
    current: CellInfo[][][] = [];
    constructor(public context: CanvasRenderingContext2D) {

    }

    add(position: [number, number], cellInfo: CellInfo) {
        if (!this.current[position[0]])
            this.current[position[0]] = [];
        if (!this.current[position[0]][position[1]])
            this.current[position[0]][position[1]] = [];
        this.current[position[0]][position[1]].push(cellInfo);
    }

    draw() {
        for (let y = 0; y < this.current.length; y++) {
            for (let x = 0; x < this.current[y].length; x++) {
                if (!(this.current[y] && this.current[y][x])) continue;

                if (!(this.previous[y] && this.previous[y][x]) || 
                    !(CanvasContext.compare(this.current[y][x], this.previous[y][x]))) {
                    for (let c of this.current[y][x]) {
                        this.drawCellInfo(y, x, c);
                    }
                }
            }
        }

        this.previous = this.current;
        this.current = [];
    }

    static compare(_this: CellInfo[], array: CellInfo[]): boolean {
        // if the other array is a falsy value, return
        if (!_this || !array)
            return false;

        // compare lengths - can save a lot of time 
        if (_this.length != array.length)
            return false;

        for (let i = 0, l = _this.length; i < l; i++) {
            if (!compare(_this[i], array[i])) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;

        function compare(a: CellInfo, b: CellInfo) {
            return a.transparent === b.transparent
                && a.border[0] === b.border[0]
                && a.border[1] === b.border[1]
                && a.border[2] === b.border[2]
                && a.border[3] === b.border[3]
                && a.cell.character === b.cell.character
                && a.cell.textColor === b.cell.textColor
                && a.cell.backgroundColor === b.cell.backgroundColor
                ;
        }
    }

    drawCellInfo(topPos: number, leftPos: number, cellInfo: CellInfo) {
        const ctx = this.context;
        //
        const left = leftPad + leftPos * cellStyle.size.width;
        const top = topPad + topPos * cellStyle.size.height;
        //
        ctx.globalAlpha = cellInfo.transparent ? 0.2 : 1;
        ctx.fillStyle = cellInfo.cell.backgroundColor;
        ctx.fillRect(left, top, cellStyle.size.width, cellStyle.size.height);
        ctx.font = `${cellStyle.charSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // ctx.globalAlpha = 1;
        ctx.fillStyle = cellInfo.cell.textColor;
        ctx.fillText(cellInfo.cell.character, left + cellStyle.size.width / 2, top + cellStyle.size.height / 2 + 2);
        if (cellStyle.borderWidth > 0) {
            ctx.strokeStyle = cellStyle.borderColor;
            ctx.lineWidth = cellStyle.borderWidth;
            // palette borders
            ctx.strokeRect(left, top, cellStyle.size.width, cellStyle.size.height);
        }
        // cell borders
        addObjectBorders();

        function addObjectBorders() {
            const borderWidth = 2;
            ctx.lineWidth = borderWidth;
            ctx.globalAlpha = cellInfo.transparent ? 0.3 : 0.6;
            if (cellInfo.border[0]) {
                ctx.strokeStyle = cellInfo.border[0];
                ctx.strokeRect(left + 1, top + 1, cellStyle.size.width - 2, 0);
            }
            if (cellInfo.border[1]) {
                ctx.strokeStyle = cellInfo.border[1];
                ctx.strokeRect(left + cellStyle.size.width - 1, top + 1, 0, cellStyle.size.height - 2);
            }
            if (cellInfo.border[2]) { 
                ctx.strokeStyle = cellInfo.border[2];
                ctx.strokeRect(left + 1, top + cellStyle.size.height - 1, cellStyle.size.width - 2, 0);
            }
            if (cellInfo.border[3]) {
                ctx.strokeStyle = cellInfo.border[3];
                ctx.strokeRect(left + 1, top + 1, 0, cellStyle.size.height - 2);
            }
        }
    }
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
    for (let object of objects) {
        if (!object.enabled)
            continue;
        drawObject(ctx, camera, object, objects.filter(x => x.important));
        // reset object highlight.
        object.highlighted = false;
    }
    // draw cursors
    for (let object of objects) {
        if (object instanceof Npc
            && (object.direction[0] || object.direction[1]) ) {
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

export function drawObjectAt(ctx: CanvasContext, camera: Camera, obj: SceneObject, position: [number ,number]) {
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
            if (isPositionBehindTheObject(obj, o.position[0], o.position[1])) return true;
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
    camera: Camera,
    cell: Cell, 
    leftPos: number, 
    topPos: number, 
    transparent: boolean = false,
    border: (string | null)[] = [null, null, null, null]) { 

    if (cell.isEmpty) return;
    if (leftPos < 0 || 
        topPos < 0 || 
        leftPos >= camera.size.width ||
        topPos >= camera.size.height) {
        return;
    }
    ctx.add([topPos, leftPos], <CellInfo>{ cell, transparent, border });
}