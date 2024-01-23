import { SceneObject } from "../objects/SceneObject";
import { Cell } from "./Cell";
import { Npc } from "../objects/Npc";
import { ObjectSkin } from "../components/ObjectSkin";
import { Camera } from "../Camera";
import { CellInfo } from "./CellInfo";
import { CanvasContext } from "./CanvasContext";
import { distanceTo } from "../../utils/misc";
import { Particle } from "../objects/Particle";
import { Position } from "../data/Position";
import { Faces } from "../data/Face";

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
            drawObject(ctx, camera, childObject, importantObjects.filter(x => x !== object));
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
    const { width, height } = objSkin.size;
    const pos = Position.from(position);
    const origin = Position.from(originPoint);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const skinPos = new Position(x, y);
            const resultPos = pos.minus(origin).plus(skinPos);
            const cells = getCellsAt(objSkin, skinPos.to());
            for (const cell of cells) {
                if (cell.isEmpty) {
                    continue;
                }

                drawCellAt(ctx, camera, cell, resultPos, undefined, undefined, layerName);
            }
        }
    }
}

function drawSceneObject(ctx: CanvasContext, camera: Camera, obj: SceneObject, transparency: ([x, y]: [number, number]) => number) {
    const cameraPos = new Position(camera.position.left, camera.position.top);
    const pos = Position.from(obj.position);
    const origin = Position.from(obj.originPoint);
    const { width, height } = obj.skin.size;
    for (let y = 0; y < height; y++) { 
        for (let x = 0; x < width; x++) {
            const skinPos = new Position(x, y);
            const transparent = transparency(skinPos.to());
            const cellBorders = getCellBorders(obj, x, y);
            const levelPos = pos.minus(origin).plus(skinPos);
            const resultPos = levelPos.minus(cameraPos);
            const cells = getCellsAt(obj.skin, skinPos.to());
            for (const cell of cells) {
                if (cell.isEmpty) {
                    continue;
                }
                
                drawCellAt(ctx, camera, cell, resultPos, transparent, cellBorders);
            }
        }
    }
    
    function getCellBorders(obj: SceneObject, x: number, y: number) {
        if (!obj.highlighted) {
            return [];
        }

        const position = new Position(x, y);
        return Faces
            .map(x => Position.fromFace(x))
            .map(x => position.plus(x))
            .map(x => obj.skin.isEmptyCellAt(x.to()) ? obj.highlighColor : null);
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

export function getCellsAt(skin: ObjectSkin, position: [number, number]): Cell[] {
    return skin.getCellsAt(position);
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

    return !object.skin.isEmptyCellAt([pleft, ptop]);
}

export function drawCellAt(
    ctx: CanvasContext,
    camera: Camera | undefined,
    cell: Cell, 
    position: Position,
    transparent: number = 1,
    border: (string | null)[] = [null, null, null, null],
    layer: "objects" | "weather" | "ui" = "objects"
) {
    drawCell(ctx, camera, cell, ...position.to(), transparent, border, layer);
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
