import { clamp } from "../../utils/math";
import { Camera } from "../Camera";
import { Scene } from "../Scene";
import { CanvasContext } from "../graphics/CanvasContext";
import { Cell } from "../graphics/Cell";
import { CellInfo } from "../graphics/CellInfo";
import { Layer } from "../graphics/Layers";
import { Box2 } from "../math/Box2";
import { Face, Faces } from "../math/Face";
import { Vector2 } from "../math/Vector2";
import { Object2D } from "../objects/Object2D";

export class CanvasRenderer {
    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasContext,
    ) {

    }

    public render(scene: Scene, camera: Camera) {
        const renderList = this.getSceneRenderList(scene); // TODO: children
        renderList.sort((a: Object2D, b: Object2D) => a.position.y - b.position.y);
        this.renderObjects(renderList, scene, camera);
    }

    private getSceneRenderList(scene: Scene): Object2D[] {
        const list = scene.children.flatMap(x => getRenderItems(x));
        return list;

        function getRenderItems(object: Object2D): Object2D[] {
            if (!object.visible) {
                return [];
            }

            if (object.children.length === 0) {
                return [object];
            }

            return [object, ...object.children.flatMap(x => getRenderItems(x))]
        }
    }

    private renderObjects(objects: Object2D[], scene: Scene, camera: Camera) {
        for (const object of objects) {
            this.renderObject(object, scene, camera);

            // TODO: move to updates.
            // reset object highlight.
            object.highlighted = false;
        }
    }

    private renderObject(object: Object2D, scene: Scene, camera: Camera) {
        const pos = object.position;
        const origin = object.originPoint;
        const isInFrontOfAnyObject = this.isInFrontOfAnyObject(object, scene.children.filter(x => x.important && x !== object.parent));
        const { width, height } = object.skin.size;
        for (let y = 0; y < height; y++) { 
            for (let x = 0; x < width; x++) {
                const skinPos = new Vector2(x, y);
                const extraOpacity = getExtraPositionalOpacity(skinPos);
                const extraBorders = this.getExtraCellBorders(object, skinPos);
                const levelPos = pos.clone().sub(origin).add(skinPos);
                const resultPos = levelPos.clone().sub(camera.position);
                const cells = object.skin.getCellsAt(skinPos).filter(x => !x.isEmpty);
                for (const cell of cells) {
                    this.drawCell(camera, cell, resultPos, extraOpacity, extraBorders, object.layer);
                }
            }
        }

        function getExtraPositionalOpacity(skinPos: Vector2) {
            if (object.layer === "objects") {
                const objectOpacity = isObjectPositionTransparent(skinPos) ? 0.2 : 1;
                return objectOpacity;
            } else if (object.layer === "particles") {
                return getParticleOpacity();
            }

            return 1;
        }

        function isObjectPositionTransparent(skinPos: Vector2): boolean {
            return isInFrontOfAnyObject && !isCollision(object, skinPos);
        }

        function isCollision(object: Object2D, position: Vector2) {
            const collisionChar = object.physics.collisions[position.y]?.[position.x] || ' ';
            return collisionChar !== ' ';
        }

        function getParticleOpacity() {
            if (!camera.npc) {
                return 1;
            }

            const distance = camera.npc.position.distanceTo(object.position);
            const fullVisibilityRange = 1.2;
            if (distance < fullVisibilityRange) {
                return 0.2;
            }

            const distanceKoef = 0.2;
            const transparency = clamp(Math.sqrt(distance * distanceKoef), 0, 1);
            return transparency;
        }
    }

    private drawCell(
        camera: Camera | undefined,
        cell: Cell, 
        cellPos: Vector2, 
        opacity: number = 1,
        border: { [key in Face]?: string } = {},
        layer: Layer) { 
    
        if (cell.isEmpty) {
            return;
        }

        if (camera) {
            const cameraBox = new Box2(new Vector2(), camera.size.clone().sub(new Vector2(1, 1)));
            if (!cameraBox.containsPoint(cellPos)) {
                return;
            }
        }
    
        const [camX, camY] = cellPos.clone().add(camera?.position || Vector2.zero);
        
        // TODO: get light from particles too.
        if (layer === "objects") {
            const color = camera?.level?.lightColorLayer?.[camY]?.[camX];
            if (color) {
                cell.lightColor = color.getStyle();
            }
        
            const intensity = camera?.level?.lightLayer?.[camY]?.[camX];
            if (intensity) {
                cell.lightIntensity = intensity;
            }
        }
        
        this.ctx.add(layer, cellPos, <CellInfo>{ cell, extraOpacity: opacity, extraBorder: border })
    }

    private getExtraCellBorders(obj: Object2D, position: Vector2) {
        if (!obj.highlighted) {
            return [];
        }

        const entries = Faces
            .map(x => {
                const dir = Vector2.fromFace(x);
                const pos = position.clone().add(dir);
                const borderColor = obj.skin.isEmptyCellAt(pos) ? obj.highlighColor : undefined;
                return [x, borderColor];
            })
            .filter(x => x[1]);
        return Object.fromEntries(entries);
    }

    private isPositionBehindTheObject(object: Object2D, position: Vector2): boolean {
        const resultPos = position.clone().sub(object.position).add(object.originPoint);
        return !object.skin.isEmptyCellAt(resultPos);
    }

    private isInFrontOfAnyObject(object: Object2D, objects: Object2D[]) {
        for (const o of objects) {
            if (this.isPositionBehindTheObject(object, o.position)) {
                return true;
            }
        }

        return false;
    }
}