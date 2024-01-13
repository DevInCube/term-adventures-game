import { SceneObject } from "../objects/SceneObject";
import { Cell } from "./Cell";
import { Npc } from "../objects/Npc";
import { ObjectSkin } from "../components/ObjectSkin";
import { Camera } from "../Camera";
import { CellInfo } from "./CellInfo";
import { CanvasContext } from "./CanvasContext";
import { distanceTo } from "../../utils/misc";
import { Particle } from "../objects/Particle";

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
        if (!object.enabled) {
            continue;
        }

        drawObject(ctx, camera, object, importantObjects);
        for (const childObject of object.children) {
            drawObject(ctx, camera, childObject, importantObjects);
        }

        // reset object highlight.
        object.highlighted = false;
    }

    // draw cursors
    for (const object of objects) {
        if (!object.enabled) {
            continue;
        }

        if (object instanceof Npc) {
            if (object.equipment.objectInMainHand) {
                object.equipment.objectInMainHand.highlighted = object.showCursor;
                object.equipment.objectInMainHand.highlighColor = 'yellow';
            }
        }
    }
}

export function drawParticles(ctx: CanvasContext, camera: Camera, particles: Particle[]) {
    for (const particle of particles) {
        if (!particle.enabled) {
            continue;
        }

        drawParticle(ctx, camera, particle);
    }
}

export function drawObjectAt(ctx: CanvasContext, camera: Camera | undefined, obj: SceneObject, position: [number, number], layerName: "objects" | "weather" | "ui" = "objects") {
    drawObjectSkinAt(ctx, camera, obj.skin, obj.originPoint, position, layerName);
}

export function drawObjectSkinAt(
    ctx: CanvasContext,
    camera: Camera | undefined,
    objSkin: ObjectSkin,
    originPoint: [number, number],
    position: [number, number],
    layerName: "objects" | "weather" | "ui" = "objects"
) {
    for (let y = 0; y < objSkin.grid.length; y++) {
        for (let x = 0; x < objSkin.grid[y].length; x++) {
            const cell = getCellAt(objSkin, x, y);
            const left = position[0] - originPoint[0] + x;
            const top = position[1] - originPoint[1] + y;
            drawCell(ctx, camera, cell, left, top, undefined, undefined, layerName);
        }
    }
}

function drawSceneObject(ctx: CanvasContext, camera: Camera, obj: SceneObject, transparency: ([x, y]: [number, number]) => number) {
    for (let y = 0; y < obj.skin.grid.length; y++) { 
        for (let x = 0; x < obj.skin.grid[y].length; x++) {
            const cell = getCellAt(obj.skin, x, y);
            if (cell.isEmpty) {
                continue;
            }

            const transparent = transparency([x, y]);
            const cellBorders = getCellBorders(obj, x, y)
            const [left, top] = [
                obj.position[0] - obj.originPoint[0] + x,
                obj.position[1] - obj.originPoint[1] + y
            ];
            const [leftPos, topPos] = [
                left - camera.position.left,
                top - camera.position.top
            ];
            drawCell(ctx, camera, cell, leftPos, topPos, transparent, cellBorders);
        }
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

        function isEmptyCell(object: SceneObject, left: number, top: number) {
            if (left < 0 || top < 0) return true;
            const grid = object.skin.grid;
            if (top >= grid.length || left >= grid[top].length) return true;
            const char = grid[top][left];
            return char === ' ';
        }
    }
}

function drawObject(ctx: CanvasContext, camera: Camera, obj: SceneObject, importantObjects: SceneObject[]) {
    let showOnlyCollisions: boolean = isInFrontOfImportantObject();

    const isTransparentCell = ([x, y]: [number, number]) => 
        (showOnlyCollisions && !isCollision(obj, x, y)) || 
        obj.realm !== camera.npc?.realm;
    drawSceneObject(ctx, camera, obj, p => isTransparentCell(p) ? 0.2 : 1);
    
    function isInFrontOfImportantObject() {
        for (const o of importantObjects) {
            if (isPositionBehindTheObject(obj, o.position[0], o.position[1])) {
                return true;
            }
        }
        return false;
    }
}

function drawParticle(ctx: CanvasContext, camera: Camera, particle: Particle) {
    const getCellTransparency = () => {
        const distance = distanceTo(camera.npc?.position!, particle.position);
        const fullVisibilityRange = 1.2;
        const koef = 0.2;
        if (distance >= fullVisibilityRange) {
            const mistTransparency = Math.max(0, Math.min(1, Math.sqrt(distance * koef)));
            return mistTransparency;
        }

        return 0.2;
    }
    drawSceneObject(ctx, camera, particle, pos => getCellTransparency());
}

export function getCellAt(skin: ObjectSkin, x: number, y:number): Cell {
    const cellColor = (skin.raw_colors[y] && skin.raw_colors[y][x]) || [undefined, 'transparent'];
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
    transparent: number = 1,
    border: (string | null)[] = [null, null, null, null],
    layer: "objects" | "weather" | "ui" = "objects") { 

    if (cell.isEmpty) return;
    if (camera) {
        if (leftPos < 0 || 
            topPos < 0 || 
            leftPos >= camera.size.width ||
            topPos >= camera.size.height) {
            return;
        }
    }

    const camX = leftPos + (camera?.position?.left || 0);
    const camY = topPos + (camera?.position?.top || 0);

    if (layer === "objects") {
        if (camera?.level?.lightColorLayer && camera?.level?.lightColorLayer[camY]) {
            const color = camera?.level?.lightColorLayer[camY][camX]; 
            const str = `#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`;
            cell.lightColor = str;
        }
    
        if (camera?.level?.lightLayer && camera?.level?.lightLayer[camY] && cell.lightIntensity === null) {
            const intensity = camera?.level?.lightLayer[camY][camX]; 
            cell.lightIntensity = intensity;
        } 
    }
    
    ctx.add(layer, [leftPos, topPos], <CellInfo>{ cell, transparent, border })
}

export function mixColors(colors: { color: [number, number, number], intensity: number }[]): [number, number, number] {
    const totalIntensity = Math.min(1, colors.reduce((a, x) => a += x.intensity / 15, 0));
    const mixedColor: [number, number, number] = [
        Math.min(255, colors.reduce((a, x) => a += x.color[0] * (x.intensity / 15), 0) / totalIntensity | 0),
        Math.min(255, colors.reduce((a, x) => a += x.color[1] * (x.intensity / 15), 0) / totalIntensity | 0),
        Math.min(255, colors.reduce((a, x) => a += x.color[2] * (x.intensity / 15), 0) / totalIntensity | 0),
    ];
    return mixedColor;
}
