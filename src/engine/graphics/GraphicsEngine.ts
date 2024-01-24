import { SceneObject } from "../objects/SceneObject";
import { Cell } from "./Cell";
import { Npc } from "../objects/Npc";
import { ObjectSkin } from "../components/ObjectSkin";
import { Camera } from "../Camera";
import { CellInfo } from "./CellInfo";
import { CanvasContext } from "./CanvasContext";
import { Particle } from "../objects/Particle";
import { Vector2 } from "../data/Vector2";
import { Faces } from "../data/Face";
import { Box2 } from "../data/Box2";

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

export function drawObjectAt(ctx: CanvasContext, camera: Camera | undefined, obj: SceneObject, position: Vector2, layerName: "objects" | "weather" | "ui" = "objects") {
    drawObjectSkinAt(ctx, camera, obj.skin, obj.originPoint, position, layerName);
}

export function drawObjectSkinAt(
    ctx: CanvasContext,
    camera: Camera | undefined,
    objSkin: ObjectSkin,
    originPoint: Vector2,
    position: Vector2,
    layerName: "objects" | "weather" | "ui" = "objects"
) {
    const { width, height } = objSkin.size;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const skinPos = new Vector2(x, y);
            const resultPos = position.clone().sub(originPoint).add(skinPos);
            const cells = getCellsAt(objSkin, skinPos);
            for (const cell of cells) {
                if (cell.isEmpty) {
                    continue;
                }

                drawCell(ctx, camera, cell, resultPos, undefined, undefined, layerName);
            }
        }
    }
}

function drawSceneObject(ctx: CanvasContext, camera: Camera, obj: SceneObject, transparency: (p: Vector2) => number) {
    const cameraPos = new Vector2(camera.position.x, camera.position.y);
    const pos = obj.position;
    const origin = obj.originPoint;
    const { width, height } = obj.skin.size;
    for (let y = 0; y < height; y++) { 
        for (let x = 0; x < width; x++) {
            const skinPos = new Vector2(x, y);
            const transparent = transparency(skinPos);
            const cellBorders = getCellBorders(obj, skinPos);
            const levelPos = pos.clone().sub(origin).add(skinPos);
            const resultPos = levelPos.clone().sub(cameraPos);
            const cells = getCellsAt(obj.skin, skinPos);
            for (const cell of cells) {
                if (cell.isEmpty) {
                    continue;
                }
                
                drawCell(ctx, camera, cell, resultPos, transparent, cellBorders);
            }
        }
    }
    
    function getCellBorders(obj: SceneObject, position: Vector2) {
        if (!obj.highlighted) {
            return [];
        }

        return Faces
            .map(x => Vector2.fromFace(x))
            .map(x => position.clone().add(x))
            .map(x => obj.skin.isEmptyCellAt(x) ? obj.highlighColor : null);
    }
}

function drawObject(ctx: CanvasContext, camera: Camera, obj: SceneObject, importantObjects: SceneObject[]) {
    let showOnlyCollisions: boolean = isInFrontOfImportantObject();

    const isTransparentCell = (position: Vector2) => 
        (showOnlyCollisions && !isCollision(obj, position)) || 
        obj.realm !== camera.npc?.realm;
    drawSceneObject(ctx, camera, obj, p => isTransparentCell(p) ? 0.2 : 1);
    
    function isInFrontOfImportantObject() {
        for (const o of importantObjects) {
            if (isPositionBehindTheObject(obj, o.position)) {
                return true;
            }
        }
        return false;
    }
}

function drawParticle(ctx: CanvasContext, camera: Camera, particle: Particle) {
    const getCellTransparency = () => {
        const distance = camera.npc!.position!.distanceTo(particle.position);
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

export function getCellsAt(skin: ObjectSkin, position: Vector2): Cell[] {
    return skin.getCellsAt(position);
}

const emptyCollisionChar = ' ';

export function isCollision(object: SceneObject, position: Vector2) {
    const cchar = object.physics.collisions[position.y]?.[position.x] || emptyCollisionChar;
    return cchar !== emptyCollisionChar;
}

export function isPositionBehindTheObject(object: SceneObject, position: Vector2): boolean {
    const resultPos = position.clone().sub(object.position).add(object.originPoint);

    // check collisions
    if (isCollision(object, resultPos)) return false;

    return !object.skin.isEmptyCellAt(resultPos);
}

export function drawCell(
    ctx: CanvasContext,
    camera: Camera | undefined,
    cell: Cell, 
    cellPos: Vector2, 
    transparent: number = 1,
    border: (string | null)[] = [null, null, null, null],
    layer: "objects" | "weather" | "ui" = "objects") { 

    if (cell.isEmpty) return;
    if (camera) {
        const cameraBox = new Box2(new Vector2(), camera.size.clone().sub(new Vector2(1, 1)));
        if (!cameraBox.containsPoint(cellPos)) {
            return;
        }
    }

    const [camX, camY] = cellPos.clone().add(camera?.position || Vector2.zero);
    
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
    
    ctx.add(layer, cellPos, <CellInfo>{ cell, transparent, border })
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
